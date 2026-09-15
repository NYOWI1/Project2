import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { calculateOrder } from './checkout.js';

const indexPath = fileURLToPath(new URL('../public/index.html', import.meta.url));

export function createServer() {
  return http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(await readFile(indexPath));
      return;
    }
    if (req.method === 'POST' && req.url === '/api/checkout') {
      try {
        let body = '';
        for await (const chunk of req) {
          body += chunk;
          if (body.length > 10_000) throw new Error('request too large');
        }
        const result = calculateOrder(JSON.parse(body));
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
      return;
    }
    res.writeHead(404);
    res.end('Not found');
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  createServer().listen(Number(process.env.PORT || 3000), '0.0.0.0', () => {
    console.log(`Checkout demo listening on port ${process.env.PORT || 3000}`);
  });
}
