import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
    {
        deviceId: { type: String, required: true, unique: true, index: true },
        riderName: { type: String, required: true },
        status: {
            type: String,
            enum: ['ACTIVE', 'IDLE', 'OFFLINE', 'ALERT'],
            default: 'ACTIVE',
        },
        helmetWorn: { type: Boolean, default: true },
        batteryLevel: { type: Number, default: 100, min: 0, max: 100 },
        gpsFix: { type: Boolean, default: true },
        networkAvailable: { type: Boolean, default: true },
        online: { type: Boolean, default: true },
        lastSeenAt: { type: Date, default: Date.now },
        lastSeenSecondsAgo: { type: Number, default: 0 },
        latitude: { type: Number, default: 11.0168 },
        longitude: { type: Number, default: 76.9558 },
        satellites: { type: Number, default: 12 },
        accuracy: { type: Number, default: 5 },
        impactMagnitude: { type: Number, default: 1 },
        tiltAngle: { type: Number, default: 0 },
        gyroscope: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            z: { type: Number, default: 0 },
        },
        accelerometer: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
            z: { type: Number, default: 9.8 },
        },
        lastKnownLocation: { type: String, default: '' },
        modules: {
            mpu6050: { type: Boolean, default: true },
            gps: { type: Boolean, default: true },
            gsm: { type: Boolean, default: true },
            oled: { type: Boolean, default: true },
            touchSensor: { type: Boolean, default: true },
        },
    },
    { timestamps: true },
);

export default mongoose.model('Device', deviceSchema);
