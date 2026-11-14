import express from 'express';
import mongoose from 'mongoose';
import Alert from '../models/Alert.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { broadcast } from '../services/realtime.js';

const router = express.Router();

const alertStore = [];

const isDbReady = () => mongoose.connection.readyState === 1;

const serializeAlert = (alert) => ({
    id: alert.publicId || alert.id || String(alert._id),
    type: alert.type,
    status: alert.status,
    deviceId: alert.deviceId,
    rider: alert.rider,
    location: alert.location,
    timestamp: alert.timestamp || alert.createdAt,
    sms: alert.sms,
    callSequence: alert.callSequence || [],
    source: alert.source,
});

async function persistAlert(payload) {
    const publicId = payload.id || `AL-${Date.now()}`;
    const doc = {
        publicId,
        deviceId: payload.deviceId || 'SH-0001',
        rider: payload.rider || 'Unassigned',
        type: payload.type,
        status: payload.status || 'INFO',
        sms: payload.sms || 'SENT',
        location: payload.location || '',
        timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
        callSequence: payload.callSequence || [],
        source: payload.source || 'system',
    };

    if (isDbReady()) {
        const saved = await Alert.create(doc);
        const serialized = serializeAlert(saved);
        broadcast('alert', serialized);
        return serialized;
    }

    const memoryAlert = {
        id: publicId,
        type: doc.type,
        status: doc.status,
        deviceId: doc.deviceId,
        rider: doc.rider,
        location: doc.location,
        timestamp: doc.timestamp.toISOString(),
        sms: doc.sms,
        callSequence: doc.callSequence,
        source: doc.source,
    };
    alertStore.unshift(memoryAlert);
    broadcast('alert', memoryAlert);
    return memoryAlert;
}

router.use(requireAuth);

router.get('/', async (req, res) => {
    try {
        if (isDbReady()) {
            const alerts = await Alert.find().sort({ timestamp: -1 }).limit(50).lean();
            return res.json({ alerts: alerts.map(serializeAlert), source: 'mongodb' });
        }

        return res.json({ alerts: alertStore, source: 'memory' });
    } catch (error) {
        console.error('Failed to fetch alerts:', error.message);
        return res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

router.post('/', requireRole('Admin', 'Operator'), async (req, res) => {
    try {
        const body = req.body || {};
        if (!body.type) {
            return res.status(400).json({ error: 'type is required' });
        }

        const alert = await persistAlert(body);
        return res.status(201).json({ success: true, alert });
    } catch (error) {
        console.error('Failed to create alert:', error.message);
        return res.status(500).json({ error: 'Failed to create alert' });
    }
});

router.post('/simulate-impact', requireRole('Admin', 'Operator'), async (req, res) => {
    try {
        const alert = await persistAlert({
            type: 'ACCIDENT',
            status: 'CRITICAL',
            deviceId: 'SH-0001',
            rider: 'Unassigned Rider',
            location: '11.0168, 76.9558',
            sms: 'SENT',
            callSequence: ['Primary Contact', 'Secondary Contact', 'Emergency Services'],
            source: 'simulator',
        });

        return res.status(201).json({ success: true, alert });
    } catch (error) {
        console.error('Failed to simulate impact:', error.message);
        return res.status(500).json({ error: 'Failed to simulate impact' });
    }
});

router.post('/manual-sos', requireRole('Admin', 'Operator'), async (req, res) => {
    try {
        const alert = await persistAlert({
            type: 'SOS',
            status: 'CRITICAL',
            deviceId: 'SH-0001',
            rider: 'Unassigned Rider',
            location: '11.0168, 76.9558',
            sms: 'SENT',
            callSequence: ['Primary Contact', 'Secondary Contact', 'Emergency Services'],
            source: 'manual',
        });

        return res.status(201).json({ success: true, alert });
    } catch (error) {
        console.error('Failed to create SOS alert:', error.message);
        return res.status(500).json({ error: 'Failed to create SOS alert' });
    }
});

export default router;
