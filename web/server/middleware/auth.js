import jwt from 'jsonwebtoken';

export function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('JWT_SECRET is required in production');
        }
        return 'dev-only-smart-helmet-secret-change-me';
    }
    return secret;
}

export function signToken(payload, options = {}) {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: process.env.JWT_EXPIRES_IN || '12h',
        ...options,
    });
}

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        req.user = jwt.verify(token, getJwtSecret());
        return next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user?.role || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        return next();
    };
}
