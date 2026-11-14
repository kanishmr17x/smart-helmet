import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import {
    ensureMemoryAdmin,
    findMemoryUserByEmail,
    findMemoryUserById,
} from '../services/memoryAuth.js';

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Try again later.' },
});

const isDbReady = () => mongoose.connection.readyState === 1;

function publicUser(user) {
    return {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        primaryContact: user.primaryContact || '',
        secondaryContact: user.secondaryContact || '',
        familyContact: user.familyContact || '',
    };
}

router.post('/login', loginLimiter, async (req, res) => {
    try {
        const email = String(req.body?.email || '').trim().toLowerCase();
        const password = String(req.body?.password || '');

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        let user = null;
        if (isDbReady()) {
            user = await User.findOne({ email }).select('+passwordHash');
        } else {
            await ensureMemoryAdmin();
            user = await findMemoryUserByEmail(email);
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = signToken({
            sub: String(user._id),
            email: user.email,
            role: user.role,
            name: user.name,
        });

        return res.json({
            success: true,
            token,
            user: publicUser(user),
        });
    } catch (error) {
        console.error('Login failed:', error.message);
        return res.status(500).json({ error: 'Login failed' });
    }
});

router.get('/me', requireAuth, async (req, res) => {
    try {
        let user = null;
        if (isDbReady()) {
            user = await User.findById(req.user.sub);
        } else {
            user = await findMemoryUserById(req.user.sub);
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ user: publicUser(user) });
    } catch (error) {
        console.error('Auth me failed:', error.message);
        return res.status(500).json({ error: 'Failed to load profile' });
    }
});

export default router;
