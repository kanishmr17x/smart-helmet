import express from 'express';
import mongoose from 'mongoose';
import Config from '../models/Config.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { broadcast } from '../services/realtime.js';

const router = express.Router();

const ALLOWED_KEYS = new Set([
    'sensitivity',
    'primaryContact',
    'secondaryContact',
    'familyContact',
    'buzzersEnabled',
    'alertVolume',
    'autoDispatch',
]);

const SENSITIVITY = new Set(['low', 'medium', 'high']);
const VOLUME = new Set(['low', 'medium', 'high']);

let configState = {
    sensitivity: 'medium',
    primaryContact: '',
    secondaryContact: '',
    familyContact: '',
    buzzersEnabled: true,
    alertVolume: 'medium',
    autoDispatch: true,
};

const isDbReady = () => mongoose.connection.readyState === 1;

function sanitizeConfig(input = {}) {
    const next = {};

    for (const [key, value] of Object.entries(input)) {
        if (!ALLOWED_KEYS.has(key)) continue;

        if (key === 'sensitivity' && !SENSITIVITY.has(value)) {
            throw new Error('Invalid sensitivity value');
        }

        if (key === 'alertVolume' && !VOLUME.has(value)) {
            throw new Error('Invalid alertVolume value');
        }

        if ((key === 'buzzersEnabled' || key === 'autoDispatch') && typeof value !== 'boolean') {
            throw new Error(`${key} must be a boolean`);
        }

        if (['primaryContact', 'secondaryContact', 'familyContact'].includes(key)) {
            if (typeof value !== 'string' || value.length > 40) {
                throw new Error(`${key} must be a string up to 40 characters`);
            }
        }

        next[key] = value;
    }

    return next;
}

function serializeConfig(doc) {
    return {
        sensitivity: doc.sensitivity,
        primaryContact: doc.primaryContact || '',
        secondaryContact: doc.secondaryContact || '',
        familyContact: doc.familyContact || '',
        buzzersEnabled: doc.buzzersEnabled,
        alertVolume: doc.alertVolume,
        autoDispatch: doc.autoDispatch,
    };
}

router.use(requireAuth);

router.get('/', async (req, res) => {
    try {
        if (isDbReady()) {
            const doc = await Config.findOne({ key: 'default' }).lean();
            if (!doc) {
                return res.json({ config: configState, source: 'mongodb' });
            }
            return res.json({ config: serializeConfig(doc), source: 'mongodb' });
        }

        return res.json({ config: configState, source: 'memory' });
    } catch (error) {
        console.error('Failed to fetch config:', error.message);
        return res.status(500).json({ error: 'Failed to fetch config' });
    }
});

router.post('/update', requireRole('Admin', 'Operator'), async (req, res) => {
    try {
        const updates = sanitizeConfig(req.body || {});

        if (isDbReady()) {
            const doc = await Config.findOneAndUpdate(
                { key: 'default' },
                { $set: updates },
                { new: true, upsert: true },
            ).lean();
            const config = serializeConfig(doc);
            broadcast('config', config);
            return res.json({ success: true, config });
        }

        configState = { ...configState, ...updates };
        broadcast('config', configState);
        return res.json({ success: true, config: configState });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

export default router;
