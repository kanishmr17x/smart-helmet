import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import http from 'http';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import connectDB from './config/db.js';
import { getJwtSecret } from './middleware/auth.js';
import alertRoutes from './routes/alertRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import configRoutes from './routes/configRoutes.js';
import authRoutes from './routes/authRoutes.js';
import deviceRoutes from './routes/deviceRoutes.js';
import { seedDefaults } from './services/seed.js';
import { registerClient } from './services/realtime.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(
    cors({
        origin(origin, callback) {
            // Browser requests always send Origin. Allow listed origins only.
            if (!origin) {
                // Non-browser clients (curl, monitors). Auth still required on protected routes.
                if (isProduction && process.env.ALLOW_NO_ORIGIN !== '1') {
                    return callback(null, false);
                }
                return callback(null, true);
            }
            if (!isProduction && allowedOrigins.length === 0) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error('Origin not allowed by CORS'));
        },
        credentials: true,
    }),
);

app.use(express.json({ limit: '100kb' }));

app.use(
    '/api',
    rateLimit({
        windowMs: 60 * 1000,
        max: Number(process.env.API_RATE_LIMIT || 120),
        standardHeaders: true,
        legacyHeaders: false,
    }),
);

app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    }[dbState] || 'unknown';

    const healthy = !isProduction || dbState === 1;

    res.status(healthy ? 200 : 503).json({
        status: healthy ? 'ok' : 'degraded',
        service: 'Smart Helmet Central Command',
        timestamp: new Date().toISOString(),
        database: dbStatus,
        mode: dbState === 1 ? 'mongodb' : 'memory',
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/config', configRoutes);
app.use('/api/devices', deviceRoutes);

app.use((err, req, res, next) => {
    if (err?.message?.includes('not allowed by CORS')) {
        return res.status(403).json({ error: 'CORS blocked' });
    }
    console.error('Unhandled error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
});

try {
    await connectDB();
    await seedDefaults();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

const shouldListen = process.env.VERCEL !== '1' && process.env.DISABLE_LISTEN !== '1';

if (shouldListen) {
    const server = http.createServer(app);
    const wss = new WebSocketServer({ server, path: '/ws' });

    wss.on('connection', (ws, req) => {
        try {
            const url = new URL(req.url || '/ws', `http://${req.headers.host || 'localhost'}`);
            const token = url.searchParams.get('token');
            if (!token) {
                ws.close(4401, 'Authentication required');
                return;
            }
            jwt.verify(token, getJwtSecret());
            registerClient(ws);
            ws.send(JSON.stringify({
                type: 'system',
                message: 'Live telemetry stream connected',
                timestamp: new Date().toISOString(),
            }));
        } catch {
            ws.close(4401, 'Invalid token');
        }
    });

    server.listen(PORT, () => {
        console.log(`Smart Helmet API running on http://localhost:${PORT}`);
    });
}

export default app;
