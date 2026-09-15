import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrder } from '../src/checkout.js';
import { createServer } from '../src/server.js';

test('checkout charges quantity times unit price and reduces stock', () => {
  assert.deepEqual(calculateOrder({ quantity: 2, unitPrice: 500, stock: 5 }),
    { quantity: 2, total: 1000, remainingStock: 3 });
});

test('checkout rejects an order larger than stock', () => {
  assert.throws(() => calculateOrder({ quantity: 6, unitPrice: 500, stock: 5 }), /insufficient stock/);
});

test('HTTP checkout endpoint returns the expected order', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api/checkout`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ quantity: 2, unitPrice: 500, stock: 5 })
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { quantity: 2, total: 1000, remainingStock: 3 });
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
