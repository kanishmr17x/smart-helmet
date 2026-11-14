import express from 'express';
import mongoose from 'mongoose';
import Device from '../models/Device.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { broadcast } from '../services/realtime.js';
import { DEFAULT_TELEMETRY } from '../services/seed.js';

const router = express.Router();

let memoryTelemetry = {
    ...DEFAULT_TELEMETRY,
    battery: DEFAULT_TELEMETRY.batteryLevel,
};

const ALLOWED_KEYS = new Set([
    'deviceId',
    'online',
    'battery',
    'batteryLevel',
    'lastSeenSecondsAgo',
    'gpsFix',
    'satellites',
    'latitude',
    'longitude',
    'accuracy',
    'impactMagnitude',
    'tiltAngle',
    'gyroscope',
    'accelerometer',
    'helmetWorn',
    'networkAvailable',
    'lastKnownLocation',
    'modules',
    'status',
    'riderName',
]);

const isDbReady = () => mongoose.connection.readyState === 1;

function serializeTelemetry(device) {
    return {
        deviceId: device.deviceId,
        riderName: device.riderName,
        status: device.status,
        online: device.online,
        battery: device.batteryLevel ?? device.battery ?? 0,
        batteryLevel: device.batteryLevel ?? device.battery ?? 0,
        lastSeenSecondsAgo: device.lastSeenSecondsAgo ?? 0,
        gpsFix: device.gpsFix,
        satellites: device.satellites,
        latitude: device.latitude,
        longitude: device.longitude,
        accuracy: device.accuracy,
        impactMagnitude: device.impactMagnitude,
        tiltAngle: device.tiltAngle,
        gyroscope: device.gyroscope,
        accelerometer: device.accelerometer,
        helmetWorn: device.helmetWorn,
        networkAvailable: device.networkAvailable,
        lastKnownLocation: device.lastKnownLocation,
        modules: device.modules,
    };
}

function normalizeUpdates(updates = {}) {
    const next = { ...updates };
    if (Object.prototype.hasOwnProperty.call(next, 'battery') && !Object.prototype.hasOwnProperty.call(next, 'batteryLevel')) {
        next.batteryLevel = next.battery;
    }
    if (Object.prototype.hasOwnProperty.call(next, 'batteryLevel') && !Object.prototype.hasOwnProperty.call(next, 'battery')) {
        next.battery = next.batteryLevel;
    }
    next.lastSeenAt = new Date();
    return next;
}

router.use(requireAuth);

router.get('/', async (req, res) => {
    try {
        const deviceId = String(req.query.deviceId || 'SH-0001');

        if (isDbReady()) {
            const device = await Device.findOne({ deviceId }).lean();
            if (!device) {
                return res.status(404).json({ error: 'Device not found' });
            }
            return res.json({ telemetry: serializeTelemetry(device), source: 'mongodb' });
        }

        return res.json({ telemetry: serializeTelemetry(memoryTelemetry), source: 'memory' });
    } catch (error) {
        console.error('Failed to fetch telemetry:', error.message);
        return res.status(500).json({ error: 'Failed to fetch telemetry' });
    }
});

router.post('/update', requireRole('Admin', 'Operator'), async (req, res) => {
    try {
        const updates = req.body || {};

        for (const key of Object.keys(updates)) {
            if (!ALLOWED_KEYS.has(key)) {
                return res.status(400).json({ error: `Unexpected field: ${key}` });
            }
        }

        const deviceId = String(updates.deviceId || 'SH-0001');
        const normalized = normalizeUpdates(updates);
        delete normalized.deviceId;

        if (isDbReady()) {
            const device = await Device.findOneAndUpdate(
                { deviceId },
                { $set: normalized },
                { new: true },
            ).lean();

            if (!device) {
                return res.status(404).json({ error: 'Device not found' });
            }

            const telemetry = serializeTelemetry(device);
            broadcast('telemetry', telemetry);
            return res.json({ success: true, telemetry });
        }

        memoryTelemetry = {
            ...memoryTelemetry,
            ...normalized,
            deviceId,
            accelerometer: normalized.accelerometer
                ? { ...memoryTelemetry.accelerometer, ...normalized.accelerometer }
                : memoryTelemetry.accelerometer,
            gyroscope: normalized.gyroscope
                ? { ...memoryTelemetry.gyroscope, ...normalized.gyroscope }
                : memoryTelemetry.gyroscope,
            modules: normalized.modules
                ? { ...memoryTelemetry.modules, ...normalized.modules }
                : memoryTelemetry.modules,
        };

        const telemetry = serializeTelemetry(memoryTelemetry);
        broadcast('telemetry', telemetry);
        return res.json({ success: true, telemetry });
    } catch (error) {
        console.error('Failed to update telemetry:', error.message);
        return res.status(500).json({ error: 'Failed to update telemetry' });
    }
});

export default router;
