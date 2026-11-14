import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Device from '../models/Device.js';
import Config from '../models/Config.js';

const DEFAULT_TELEMETRY = {
    deviceId: 'SH-0001',
    riderName: 'Unassigned Rider',
    status: 'ACTIVE',
    online: true,
    batteryLevel: 82,
    lastSeenSecondsAgo: 3,
    gpsFix: true,
    satellites: 12,
    latitude: 11.0168,
    longitude: 76.9558,
    accuracy: 4.8,
    impactMagnitude: 1.42,
    tiltAngle: 32,
    gyroscope: { x: 12, y: 4, z: 8 },
    accelerometer: { x: 1.02, y: 0.31, z: 9.72 },
    helmetWorn: true,
    networkAvailable: true,
    lastKnownLocation: '11.0168, 76.9558',
    modules: {
        mpu6050: true,
        gps: true,
        gsm: true,
        oled: true,
        touchSensor: true,
    },
};

export async function seedDefaults() {
    if (mongoose.connection.readyState !== 1) return;

    const email = (process.env.ADMIN_EMAIL || 'admin@smarthelmet.local').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'ChangeMeNow!123';
    const existingAdmin = await User.findOne({ email });

    if (!existingAdmin) {
        const passwordHash = await bcrypt.hash(password, 12);
        await User.create({
            name: process.env.ADMIN_NAME || 'Command Admin',
            email,
            passwordHash,
            role: 'Admin',
        });
        console.log(`Seeded admin user: ${email}`);
        if (!process.env.ADMIN_PASSWORD) {
            console.warn('Using default ADMIN_PASSWORD. Set ADMIN_PASSWORD before production use.');
        }
    }

    await Device.findOneAndUpdate(
        { deviceId: DEFAULT_TELEMETRY.deviceId },
        { $setOnInsert: DEFAULT_TELEMETRY },
        { upsert: true, new: true },
    );

    await Device.findOneAndUpdate(
        { deviceId: 'SH-0002' },
        {
            $setOnInsert: {
                deviceId: 'SH-0002',
                riderName: 'Fleet Unit 2',
                status: 'IDLE',
                batteryLevel: 64,
                online: true,
                networkAvailable: true,
                gpsFix: true,
                latitude: 11.0247,
                longitude: 76.9612,
            },
        },
        { upsert: true, new: true },
    );

    await Config.findOneAndUpdate(
        { key: 'default' },
        {
            $setOnInsert: {
                key: 'default',
                sensitivity: 'medium',
                primaryContact: '',
                secondaryContact: '',
                familyContact: '',
                buzzersEnabled: true,
                alertVolume: 'medium',
                autoDispatch: true,
            },
        },
        { upsert: true, new: true },
    );
}

export { DEFAULT_TELEMETRY };
