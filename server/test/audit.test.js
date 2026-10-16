const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

// Helper to simulate HTTP requests without listening on a port
function makeRequest(path, { method = 'GET', headers = {}, body = null } = {}) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const server = http.createServer(app);

    server.listen(0, () => {
      const port = server.address().port;
      const parsedBody = body ? JSON.stringify(body) : null;
      const reqHeaders = {
        'Content-Type': 'application/json',
        ...headers
      };
      if (parsedBody) {
        reqHeaders['Content-Length'] = Buffer.byteLength(parsedBody);
      }

      const req = http.request({
        hostname: 'localhost',
        port,
        path,
        method,
        headers: reqHeaders
      }, (res) => {
        let raw = '';
        res.on('data', chunk => { raw += chunk; });
        res.on('end', () => {
          server.close();
          let json = null;
          try { json = JSON.parse(raw); } catch (e) {}
          resolve({ status: res.statusCode, body: json, text: raw });
        });
      });

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (parsedBody) req.write(parsedBody);
      req.end();
    });
  });
}

test('1. Health Check & Database Connection (Non-hanging & immediate)', async () => {
  const start = Date.now();
  const res = await makeRequest('/api/v1/health');
  const duration = Date.now() - start;

  assert.equal(res.status, 200, 'Health endpoint should return 200');
  assert.ok(duration < 2000, `Health check must respond quickly, took ${duration}ms`);
  assert.equal(res.body.status, 'success');
  assert.ok(res.body.data.database, 'Should report database status');
  assert.ok(['connected', 'mock_data'].includes(res.body.data.database.status));
});

test('2. Authentication - Missing token returns 401 Unauthorized', async () => {
  const res = await makeRequest('/api/v1/auth/me');
  assert.equal(res.status, 401, 'Protected route without token should be 401');
  assert.ok(res.body.message.includes('رمز المصادقة'));
});

test('3. Authentication - Dev Admin Token authenticates with admin role', async () => {
  const res = await makeRequest('/api/v1/auth/me', {
    headers: { Authorization: 'Bearer dev-token-admin' }
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.user.role, 'admin');
  assert.equal(res.body.data.user.email, 'admin@mavex.com');
});

test('4. Authentication - Structured Dev Token for Department Manager', async () => {
  const res = await makeRequest('/api/v1/auth/me', {
    headers: { Authorization: 'Bearer dev-token:department_manager:quality:quality@mavex.com' }
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.data.user.role, 'department_manager');
  assert.equal(res.body.data.user.departmentId, 'quality');
});

test('5. RBAC Authorization - Non-admin cannot post to admin-only violations route', async () => {
  const res = await makeRequest('/api/v1/violations', {
    method: 'POST',
    headers: { Authorization: 'Bearer dev-token:department_manager:quality:quality@mavex.com' },
    body: { code: 'V-999', description: 'Test violation' }
  });
  assert.equal(res.status, 403, 'Department manager should be forbidden from admin-only route');
});

test('6. RBAC Authorization - Admin CAN post to admin-only violations route', async () => {
  const res = await makeRequest('/api/v1/violations', {
    method: 'POST',
    headers: { Authorization: 'Bearer dev-token-admin' },
    body: {
      code: 'V-TEST',
      dept: 'الإنتاج',
      description: 'مخالفة اختبارية تجريبية',
      action: 'إجراء تصحيحي فوري',
      status: 'pending'
    }
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.data.violation.code, 'V-TEST');
});

test('7. RBAC Department Scope - Quality manager can post quality event', async () => {
  const res = await makeRequest('/api/v1/quality/events', {
    method: 'POST',
    headers: { Authorization: 'Bearer dev-token:department_manager:quality:quality@mavex.com' },
    body: {
      title: 'فحص جودة عينات اللحام',
      itemOrMachine: 'خط الإنتاج ب',
      status: 'passed',
      month: '2026-10'
    }
  });
  assert.equal(res.status, 201);
  assert.equal(res.body.data.event.title, 'فحص جودة عينات اللحام');
});

test('8. RBAC Department Scope - Maintenance manager cannot post quality event', async () => {
  const res = await makeRequest('/api/v1/quality/events', {
    method: 'POST',
    headers: { Authorization: 'Bearer dev-token:department_manager:maintenance:maintenance@mavex.com' },
    body: {
      title: 'محاولة اختراق الصلاحيات',
      status: 'passed'
    }
  });
  assert.equal(res.status, 403, 'Cross-department manager should be blocked with 403 Forbidden');
});

test('9. Database & Mock Data - All 8 departments accessible in dashboard endpoint', async () => {
  const res = await makeRequest('/api/v1/dashboard?month=2026-10', {
    headers: { Authorization: 'Bearer dev-token-admin' }
  });
  assert.equal(res.status, 200);
  assert.ok(res.body.data.departments.length >= 8, 'Should return at least 8 operational departments');
  const deptIds = res.body.data.departments.map(d => d.departmentId);
  assert.ok(deptIds.includes('quality'), 'Must include quality');
  assert.ok(deptIds.includes('safety'), 'Must include safety');
  assert.ok(deptIds.includes('violations'), 'Must include violations');
});
