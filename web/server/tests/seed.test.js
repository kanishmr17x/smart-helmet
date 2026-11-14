import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_TELEMETRY } from '../services/seed.js';

test('default telemetry includes required device fields', () => {
    assert.equal(DEFAULT_TELEMETRY.deviceId, 'SH-0001');
    assert.equal(typeof DEFAULT_TELEMETRY.batteryLevel, 'number');
    assert.equal(typeof DEFAULT_TELEMETRY.modules.gps, 'boolean');
});
