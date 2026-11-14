import bcrypt from 'bcryptjs';

const memoryUsers = [];

export async function ensureMemoryAdmin() {
    if (memoryUsers.length > 0) return memoryUsers[0];

    const email = (process.env.ADMIN_EMAIL || 'admin@smarthelmet.local').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'ChangeMeNow!123';
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        _id: 'memory-admin',
        name: process.env.ADMIN_NAME || 'Command Admin',
        email,
        passwordHash,
        role: 'Admin',
        phone: '',
        primaryContact: '',
        secondaryContact: '',
        familyContact: '',
    };

    memoryUsers.push(user);
    console.warn(`Memory-mode admin ready: ${email}`);
    return user;
}

export async function findMemoryUserByEmail(email) {
    await ensureMemoryAdmin();
    return memoryUsers.find((user) => user.email === String(email || '').toLowerCase()) || null;
}

export async function findMemoryUserById(id) {
    await ensureMemoryAdmin();
    return memoryUsers.find((user) => String(user._id) === String(id)) || null;
}
