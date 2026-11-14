import mongoose from 'mongoose';

const connectDB = async () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const allowMemoryMode = !isProduction && process.env.ALLOW_MEMORY_MODE !== '0';
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        if (isProduction) {
            throw new Error('MONGO_URI is required in production');
        }
        if (!allowMemoryMode) {
            throw new Error('MONGO_URI is required when ALLOW_MEMORY_MODE=0');
        }
        console.warn('MONGO_URI not set. Running in memory mode (development only).');
        return false;
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 8000,
        });
        console.log('MongoDB connected successfully');
        return true;
    } catch (error) {
        const message = error?.message || 'Unknown MongoDB connection error';
        if (isProduction || !allowMemoryMode) {
            throw new Error(`MongoDB connection failed: ${message}`);
        }
        console.warn('MongoDB unavailable. Running in memory mode:', message);
        return false;
    }
};

export default connectDB;
