import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        passwordHash: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: ['Admin', 'Operator', 'Rider'],
            default: 'Operator',
        },
        phone: { type: String, default: '' },
        primaryContact: { type: String, default: '' },
        secondaryContact: { type: String, default: '' },
        familyContact: { type: String, default: '' },
        emergencyContacts: [{ type: String }],
    },
    { timestamps: true },
);

export default mongoose.model('User', userSchema);
