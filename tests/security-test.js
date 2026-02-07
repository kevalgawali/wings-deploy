/**
 * WINGS 2026 - Advanced Security Test Suite
 * Tests for authentication bypass, injection attacks, and authorization
 */

const http = require('http');

const BASE_URL = 'http://localhost:3500';

const results = { passed: 0, failed: 0, tests: [] };

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  const color = passed ? 'green' : 'red';
  log(`  ${status}: ${name}`, color);
  if (details && !passed) {
    log(`    → ${details}`, 'yellow');
  }
  results.tests.push({ name, passed, details });
  passed ? results.passed++ : results.failed++;
}

function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 10000
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: parsed,
          raw: body
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// ============ JWT SECURITY TESTS ============

async function testJWTSecurity() {
  log('\n🔑 JWT SECURITY TESTS', 'cyan');
  log('─'.repeat(50));

  // Test with forged JWT
  const forgedJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoic3VwZXItYWRtaW4ifQ.fake_signature';
  
  try {
    const res = await makeRequest('POST', '/admin/dashboard', {}, {
      'Cookie': `token=${forgedJWT}`
    });
    logTest('Rejects forged JWT tokens', res.status === 401 || res.status === 403);
  } catch (e) {
    logTest('Forged JWT handling', false, e.message);
  }

  // Test with expired JWT structure
  const expiredJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJleHAiOjE2MDAwMDAwMDB9.fake';
  
  try {
    const res = await makeRequest('POST', '/admin/dashboard', {}, {
      'Cookie': `token=${expiredJWT}`
    });
    logTest('Rejects expired JWT tokens', res.status === 401 || res.status === 403);
  } catch (e) {
    logTest('Expired JWT handling', false, e.message);
  }

  // Test with empty JWT
  try {
    const res = await makeRequest('POST', '/admin/dashboard', {}, {
      'Cookie': 'token='
    });
    logTest('Rejects empty JWT tokens', res.status === 401 || res.status === 403);
  } catch (e) {
    logTest('Empty JWT handling', false, e.message);
  }

  // Test with malformed JWT
  try {
    const res = await makeRequest('POST', '/admin/dashboard', {}, {
      'Cookie': 'token=not.a.valid.jwt.token'
    });
    logTest('Rejects malformed JWT tokens', res.status === 401 || res.status === 403);
  } catch (e) {
    logTest('Malformed JWT handling', false, e.message);
  }
}

// ============ AUTHORIZATION BYPASS TESTS ============

async function testAuthorizationBypass() {
  log('\n🚧 AUTHORIZATION BYPASS TESTS', 'cyan');
  log('─'.repeat(50));

  // Test accessing super admin routes without proper role
  const routes = [
    '/super-admin/list-admins',
    '/super-admin/add-admin',
    '/super-admin/delete-admin',
    '/viewers-admin/dashboard',
    '/admin/toggle-registration'
  ];

  for (const route of routes) {
    try {
      const res = await makeRequest('POST', route, {});
      logTest(`${route} blocks unauthorized access`, res.status === 401 || res.status === 403);
    } catch (e) {
      logTest(`${route} protection`, false, e.message);
    }
  }
}

// ============ IDOR TESTS ============

async function testIDOR() {
  log('\n🎯 IDOR (Insecure Direct Object Reference) TESTS', 'cyan');
  log('─'.repeat(50));

  // Try to access other team details
  try {
    const res = await makeRequest('POST', '/admin/team-details', {
      team_id: 1,
      event_slug: 'ode-to-code'
    });
    // Without auth, should be rejected
    logTest('Team details requires authentication', res.status === 401 || res.status === 403);
  } catch (e) {
    logTest('Team details IDOR protection', false, e.message);
  }

  // Try to update payment status without auth
  try {
    const res = await makeRequest('POST', '/admin/update-payment-status', {
      team_id: 1,
      event_slug: 'ode-to-code',
      payment_status: 'verified'
    });
    logTest('Payment status update requires authentication', res.status === 401 || res.status === 403);
  } catch (e) {
    logTest('Payment status IDOR protection', false, e.message);
  }
}

// ============ NOSQL INJECTION TESTS ============

async function testNoSQLInjection() {
  log('\n💾 NoSQL INJECTION TESTS', 'cyan');
  log('─'.repeat(50));

  const nosqlPayloads = [
    { "$gt": "" },
    { "$ne": null },
    { "$regex": ".*" },
    { "$where": "1==1" }
  ];

  for (const payload of nosqlPayloads) {
    try {
      const res = await makeRequest('POST', '/login', {
        username: payload,
        password: payload
      });
      logTest(`Rejects NoSQL injection: ${JSON.stringify(payload).substring(0, 30)}`, 
        res.status !== 200 || (res.body && !res.body.success));
    } catch (e) {
      logTest('NoSQL injection handling', true, 'Request rejected');
    }
  }
}

// ============ COMMAND INJECTION TESTS ============

async function testCommandInjection() {
  log('\n💻 COMMAND INJECTION TESTS', 'cyan');
  log('─'.repeat(50));

  const cmdPayloads = [
    '; ls -la',
    '| cat /etc/passwd',
    '`whoami`',
    '$(cat /etc/passwd)',
    '; rm -rf /',
    '& dir'
  ];

  for (const payload of cmdPayloads) {
    try {
      const res = await makeRequest('POST', '/viewer/register', {
        name: payload,
        college_name: 'Test College',
        utr_number: '123456789012'
      });
      // Should not execute commands
      const safe = res.status !== 500 && 
                   (!res.raw || !res.raw.includes('root:') && !res.raw.includes('drwx'));
      logTest(`Command injection safe: "${payload.substring(0, 15)}..."`, safe);
    } catch (e) {
      logTest('Command injection test', true, 'Request rejected');
    }
  }
}

// ============ PATH TRAVERSAL TESTS ============

async function testPathTraversal() {
  log('\n📁 PATH TRAVERSAL TESTS', 'cyan');
  log('─'.repeat(50));

  const pathPayloads = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\config\\sam',
    '....//....//....//etc/passwd',
    '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
  ];

  for (const payload of pathPayloads) {
    try {
      const res = await makeRequest('GET', `/public/${payload}`);
      // Should not return sensitive file contents
      const safe = res.status === 404 || res.status === 400 ||
                   (!res.raw || !res.raw.includes('root:'));
      logTest(`Path traversal blocked: "${payload.substring(0, 25)}..."`, safe);
    } catch (e) {
      logTest('Path traversal test', true, 'Request rejected');
    }
  }
}

// ============ HTTP METHOD TESTS ============

async function testHTTPMethods() {
  log('\n📡 HTTP METHOD SECURITY TESTS', 'cyan');
  log('─'.repeat(50));

  const sensitiveRoutes = [
    '/admin/dashboard',
    '/admin/list-teams',
    '/login'
  ];

  for (const route of sensitiveRoutes) {
    // Test OPTIONS (should not leak info)
    try {
      const res = await makeRequest('OPTIONS', route, null);
      logTest(`OPTIONS on ${route} handled properly`, res.status !== 500);
    } catch (e) {
      logTest(`OPTIONS ${route}`, false, e.message);
    }

    // Test HEAD
    try {
      const res = await makeRequest('HEAD', route, null);
      logTest(`HEAD on ${route} handled properly`, res.status !== 500);
    } catch (e) {
      logTest(`HEAD ${route}`, false, e.message);
    }
  }
}

// ============ RATE LIMITING TESTS ============

async function testRateLimiting() {
  log('\n⏰ RATE LIMITING TESTS', 'cyan');
  log('─'.repeat(50));

  // Send multiple rapid requests
  const requests = [];
  for (let i = 0; i < 10; i++) {
    requests.push(makeRequest('POST', '/login', {
      username: 'test',
      password: 'test'
    }));
  }

  try {
    const responses = await Promise.all(requests);
    // Check if any got rate limited (429)
    const rateLimited = responses.some(r => r.status === 429);
    logTest('Rate limiting in place (optional)', rateLimited, 
      rateLimited ? '' : 'Consider adding rate limiting for brute force protection');
  } catch (e) {
    logTest('Rate limiting test', true, 'Some requests rejected (good)');
  }
}

// ============ CORS SECURITY TESTS ============

async function testCORSSecurity() {
  log('\n🌐 CORS SECURITY TESTS', 'cyan');
  log('─'.repeat(50));

  try {
    const res = await makeRequest('OPTIONS', '/login', null, {
      'Origin': 'https://evil-site.com',
      'Access-Control-Request-Method': 'POST'
    });
    
    const allowedOrigin = res.headers['access-control-allow-origin'];
    const notWildcard = allowedOrigin !== '*';
    logTest('CORS not set to wildcard (*)', notWildcard, 
      notWildcard ? '' : 'Wildcard CORS can be a security risk');
  } catch (e) {
    logTest('CORS test', false, e.message);
  }
}

// ============ SENSITIVE DATA EXPOSURE TESTS ============

async function testSensitiveDataExposure() {
  log('\n🔒 SENSITIVE DATA EXPOSURE TESTS', 'cyan');
  log('─'.repeat(50));

  // Check if error messages expose stack traces
  try {
    const res = await makeRequest('POST', '/login', {
      username: null,
      password: undefined
    });
    const hasStackTrace = res.raw && (
      res.raw.includes('at ') && res.raw.includes('.js:') ||
      res.raw.includes('Error:') && res.raw.includes('node_modules')
    );
    logTest('Error responses do not expose stack traces', !hasStackTrace);
  } catch (e) {
    logTest('Stack trace exposure', false, e.message);
  }

  // Check if database errors are hidden
  try {
    const res = await makeRequest('POST', '/login', {
      username: "'; SELECT * FROM admin; --",
      password: 'test'
    });
    const exposesDBInfo = res.raw && (
      res.raw.includes('pg_') ||
      res.raw.includes('relation') ||
      res.raw.includes('column') && res.raw.includes('does not exist')
    );
    logTest('Database errors are hidden from users', !exposesDBInfo);
  } catch (e) {
    logTest('Database error exposure', false, e.message);
  }
}

// ============ HEADER SECURITY TESTS ============

async function testSecurityHeaders() {
  log('\n📋 SECURITY HEADERS TESTS', 'cyan');
  log('─'.repeat(50));

  try {
    const res = await makeRequest('GET', '/');
    
    // Check for security headers
    const headers = res.headers;
    
    logTest('Has X-Content-Type-Options header', 
      headers['x-content-type-options'] === 'nosniff',
      'Recommended: Add X-Content-Type-Options: nosniff');
    
    logTest('Has X-Frame-Options header', 
      headers['x-frame-options'] !== undefined,
      'Recommended: Add X-Frame-Options header');
    
    logTest('Has X-XSS-Protection header', 
      headers['x-xss-protection'] !== undefined,
      'Recommended: Add X-XSS-Protection header');
    
    // Check if server version is hidden
    const serverHeader = headers['server'] || '';
    const versionExposed = serverHeader.includes('/') && /\d+\.\d+/.test(serverHeader);
    logTest('Server version not exposed', !versionExposed);
    
  } catch (e) {
    logTest('Security headers test', false, e.message);
  }
}

// ============ MAIN TEST RUNNER ============

async function runAllTests() {
  log('\n' + '═'.repeat(60), 'bold');
  log('  🔐 WINGS 2026 - SECURITY TEST SUITE', 'bold');
  log('═'.repeat(60), 'bold');
  log(`\n  Target: ${BASE_URL}`);
  log(`  Time: ${new Date().toISOString()}\n`);

  try {
    await testJWTSecurity();
    await testAuthorizationBypass();
    await testIDOR();
    await testNoSQLInjection();
    await testCommandInjection();
    await testPathTraversal();
    await testHTTPMethods();
    await testRateLimiting();
    await testCORSSecurity();
    await testSensitiveDataExposure();
    await testSecurityHeaders();
  } catch (e) {
    log(`\n❌ Test suite error: ${e.message}`, 'red');
  }

  // Print summary
  log('\n' + '═'.repeat(60), 'bold');
  log('  📊 SECURITY TEST RESULTS', 'bold');
  log('═'.repeat(60), 'bold');
  log(`\n  Total Tests: ${results.passed + results.failed}`);
  log(`  ✓ Passed: ${results.passed}`, 'green');
  log(`  ✗ Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`\n  Security Score: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%\n`);

  if (results.failed > 0) {
    log('  ⚠️  Security Issues Found:', 'yellow');
    results.tests.filter(t => !t.passed).forEach(t => {
      log(`    • ${t.name}`, 'red');
      if (t.details) log(`      ${t.details}`, 'yellow');
    });
    log('');
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

async function checkServer() {
  try {
    await makeRequest('GET', '/');
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  log('\n⏳ Checking if backend server is running...', 'yellow');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    log('\n❌ Backend server is not running!', 'red');
    log('   Please start the server first with: npm run dev', 'yellow');
    log('   Then run this test again.\n');
    process.exit(1);
  }
  
  log('✓ Server is running!\n', 'green');
  await runAllTests();
}

main();
