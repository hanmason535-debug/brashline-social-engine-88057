/**
 * File overview: tools/ttfb.cjs
 *
 * Node script that measures local TTFB for the dev server.
 * Behavior:
 * - Issues a single HTTP GET to the Vite dev URL and logs status, TTFB, and total time.
 * Performance:
 * - Intended for quick local diagnostics; does not run as part of the runtime bundle.
 */
const http = require('http');
const url = 'http://localhost:5173/';
const start = Date.now();
const req = http.get(url, (res) => {
  console.log('status', res.statusCode);
  const ttfb = Date.now() - start;
  console.log('TTFB:', ttfb + 'ms');
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => console.log('Total:', Date.now() - start + 'ms'));
});
req.on('error', (e) => { console.error('ERROR', e.message); process.exit(1); });
