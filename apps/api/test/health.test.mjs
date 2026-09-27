import assert from 'node:assert/strict';
import test from 'node:test';
import { createApp } from '../src/app.js';
import { getJson, requestJson } from './http-helpers.mjs';

test('GET /api/health reports a ready database', async () => {
  const app = createApp({
    database: { ping: async () => undefined },
  });

  const response = await getJson(app, '/api/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    data: { status: 'ok', database: 'connected' },
  });
});

test('GET /api/health uses the error envelope when database is unavailable', async () => {
  const app = createApp({
    database: { ping: async () => { throw new Error('connection refused'); } },
  });

  const response = await getJson(app, '/api/health');

  assert.equal(response.status, 503);
  assert.deepEqual(response.body, {
    error: {
      code: 'DATABASE_UNAVAILABLE',
      message: 'Database is unavailable. Check the API database configuration and connection.',
    },
  });
});

test('unknown routes use the standard error envelope', async () => {
  const app = createApp({
    database: { ping: async () => undefined },
  });

  const response = await getJson(app, '/api/unknown');

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {
    error: {
      code: 'NOT_FOUND',
      message: 'Route GET /api/unknown was not found.',
    },
  });
});

test('malformed JSON uses the standard validation error envelope', async () => {
  const app = createApp({
    database: { ping: async () => undefined },
  });

  const response = await requestJson(app, {
    path: '/api/health',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{',
  });

  assert.equal(response.status, 400);
  assert.deepEqual(response.body, {
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Request body must be valid JSON.',
    },
  });
});
