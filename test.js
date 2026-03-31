const http = require('http');
const server = require('./dist/index');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

function request(path, method) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: '127.0.0.1', port: addr.port, path, method: method || 'GET' };
    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

let addr;

async function runTests() {
  console.log('GET /api/greeting');
  const res = await request('/api/greeting');
  assert(res.status === 200, 'status is 200');
  assert(res.headers['content-type'].includes('application/json'), 'content-type is application/json');
  const data = JSON.parse(res.body);
  assert(typeof data.greeting === 'string', 'greeting is a string');
  assert(data.greeting.length > 0, 'greeting is non-empty');

  console.log('GET /api/greeting randomness');
  const results = new Set();
  for (let i = 0; i < 20; i++) {
    const r = await request('/api/greeting');
    results.add(JSON.parse(r.body).greeting);
  }
  assert(results.size > 1, 'greeting varies across requests');

  console.log('POST /api/greeting');
  const postRes = await request('/api/greeting', 'POST');
  assert(postRes.status === 405, 'POST returns 405');

  console.log('GET /unknown');
  const notFound = await request('/unknown');
  assert(notFound.status === 404, 'unknown route returns 404');

  console.log('GET /');
  const indexRes = await request('/');
  assert(indexRes.status === 200, 'index returns 200');
  assert(indexRes.headers['content-type'].includes('text/html'), 'index content-type is text/html');
  assert(indexRes.body.includes('<!DOCTYPE html>'), 'index contains HTML');
}

server.listen(0, '127.0.0.1', () => {
  addr = server.address();
  runTests()
    .catch((err) => { console.error(err); failed++; })
    .finally(() => {
      server.close();
      console.log(`\n${passed} passed, ${failed} failed`);
      process.exit(failed > 0 ? 1 : 0);
    });
});
