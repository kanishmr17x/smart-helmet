import assert from 'node:assert/strict';
import test from 'node:test';
import jwt from 'jsonwebtoken';
import { getJwtSecret, requireAuth, signToken } from '../middleware/auth.js';

test('signToken creates a verifiable JWT', () => {
    const token = signToken({ sub: 'user-1', role: 'Admin' });
    const decoded = jwt.verify(token, getJwtSecret());
    assert.equal(decoded.sub, 'user-1');
    assert.equal(decoded.role, 'Admin');
});

test('requireAuth rejects missing bearer token', () => {
    const req = { headers: {} };
    let statusCode = 0;
    let body = null;
    const res = {
        status(code) {
            statusCode = code;
            return this;
        },
        json(payload) {
            body = payload;
            return this;
        },
    };

    requireAuth(req, res, () => {
        throw new Error('next should not be called');
    });

    assert.equal(statusCode, 401);
    assert.equal(body.error, 'Authentication required');
});

test('requireAuth accepts valid bearer token', () => {
    const token = signToken({ sub: 'user-2', role: 'Operator' });
    const req = { headers: { authorization: `Bearer ${token}` } };
    let called = false;

    requireAuth(req, { status() { return this; }, json() { return this; } }, () => {
        called = true;
    });

    assert.equal(called, true);
    assert.equal(req.user.sub, 'user-2');
});
