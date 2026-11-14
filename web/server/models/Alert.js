import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
    {
        publicId: { type: String, required: true, unique: true, index: true },
        deviceId: { type: String, required: true, index: true },
        rider: { type: String, default: 'Unassigned' },
        type: {
            type: String,
            enum: ['ACCIDENT', 'SOS', 'WORN_CHECK', 'CANCELLED', 'DISPATCH_ACTIVE'],
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['INFO', 'WARNING', 'CRITICAL'],
            default: 'INFO',
            index: true,
        },
        sms: {
            type: String,
            enum: ['SENT', 'FAILED'],
            default: 'SENT',
        },
        location: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now, index: true },
        callSequence: [{ type: String }],
        source: { type: String, default: 'system' },
    },
    { timestamps: true },
);

alertSchema.index({ deviceId: 1, timestamp: -1 });

export default mongoose.model('Alert', alertSchema);
