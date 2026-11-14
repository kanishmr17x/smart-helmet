import express from 'express';
import mongoose from 'mongoose';
import Device from '../models/Device.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

const isDbReady = () => mongoose.connection.readyState === 1;

const memoryDevices = [
    {
        deviceId: 'SH-0001',
        riderName: 'Unassigned Rider',
        status: 'ACTIVE',
        batteryLevel: 82,
        online: true,
        gpsFix: true,
        networkAvailable: true,
        helmetWorn: true,
        lastSeenAt: new Date().toISOString(),
    },
    {
        deviceId: 'SH-0002',
        riderName: 'Fleet Unit 2',
        status: 'IDLE',
        batteryLevel: 64,
        online: true,
        gpsFix: true,
        networkAvailable: true,
        helmetWorn: true,
        lastSeenAt: new Date().toISOString(),
    },
];

function serializeDevice(device) {
    return {
        id: device._id ? String(device._id) : device.deviceId,
        deviceId: device.deviceId,
        riderName: device.riderName,
        status: device.status,
        batteryLevel: device.batteryLevel,
        online: device.online,
        gpsFix: device.gpsFix,
        networkAvailable: device.networkAvailable,
        helmetWorn: device.helmetWorn,
        latitude: device.latitude,
        longitude: device.longitude,
        lastSeenAt: device.lastSeenAt,
    };
}

router.use(requireAuth);

router.get('/', async (req, res) => {
    try {
        if (isDbReady()) {
            const devices = await Device.find().sort({ deviceId: 1 }).lean();
            return res.json({ devices: devices.map(serializeDevice), source: 'mongodb' });
        }
        return res.json({ devices: memoryDevices.map(serializeDevice), source: 'memory' });
    } catch (error) {
        console.error('Failed to fetch devices:', error.message);
        return res.status(500).json({ error: 'Failed to fetch devices' });
    }
});

router.patch('/:deviceId', requireRole('Admin', 'Operator'), async (req, res) => {
    try {
        const allowed = ['riderName', 'status', 'helmetWorn', 'online', 'networkAvailable'];
        const updates = {};
        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) {
                updates[key] = req.body[key];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        if (isDbReady()) {
            const device = await Device.findOneAndUpdate(
                { deviceId: req.params.deviceId },
                { $set: updates },
                { new: true },
            ).lean();

            if (!device) {
                return res.status(404).json({ error: 'Device not found' });
            }

            return res.json({ success: true, device: serializeDevice(device) });
        }

        const idx = memoryDevices.findIndex((d) => d.deviceId === req.params.deviceId);
        if (idx < 0) {
            return res.status(404).json({ error: 'Device not found' });
        }
        memoryDevices[idx] = { ...memoryDevices[idx], ...updates };
        return res.json({ success: true, device: serializeDevice(memoryDevices[idx]) });
    } catch (error) {
        console.error('Failed to update device:', error.message);
        return res.status(500).json({ error: 'Failed to update device' });
    }
});

export default router;
