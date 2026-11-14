import mongoose from 'mongoose';

const configSchema = new mongoose.Schema(
    {
        key: { type: String, required: true, unique: true, default: 'default' },
        sensitivity: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        primaryContact: { type: String, default: '' },
        secondaryContact: { type: String, default: '' },
        familyContact: { type: String, default: '' },
        buzzersEnabled: { type: Boolean, default: true },
        alertVolume: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        autoDispatch: { type: Boolean, default: true },
    },
    { timestamps: true },
);

export default mongoose.model('Config', configSchema);
