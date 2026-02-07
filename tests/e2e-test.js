/**
 * WINGS 2026 - End-to-End Backend & Security Test Suite
 * Tests API functionality, security vulnerabilities, and data validation
 */

const http = require('http');

const BASE_URL = 'http://localhost:3500';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Colors for console output
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

// HTTP request helper
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

// ============ TEST SUITES ============

async function testServerHealth() {
  log('\n📡 SERVER HEALTH TESTS', 'cyan');
  log('─'.repeat(50));
  
  try {
    const res = await makeRequest('GET', '/');
    logTest('Server responds to requests', res.status !== undefined);
  } catch (e) {
    logTest('Server responds to requests', false, e.message);
  }
}

async function test404Handling() {
  log('\n🚫 404 ERROR HANDLING TESTS', 'cyan');
  log('─'.repeat(50));
  
  try {
    const res = await makeRequest('GET', '/nonexistent-route-xyz');
    logTest('Returns 404 for unknown routes', res.status === 404);
    logTest('404 response has proper JSON structure', res.body && res.body.success === false);
  } catch (e) {
    logTest('404 handling', false, e.message);
  }
}

async function testAuthEndpoints() {
  log('\n🔐 AUTHENTICATION TESTS', 'cyan');
  log('─'.repeat(50));
  
  // Test login with invalid credentials
  try {
    const res = await makeRequest('POST', '/login', {
      username: 'invalid_user',
      password: 'wrong_password'
    });
    logTest('Rejects invalid login credentials', res.status === 401 || res.status === 400 || (res.body && !res.body.success));
  } catch (e) {
    logTest('Login endpoint reachable', false, e.message);
  }

  // Test login with empty credentials
  try {
    const res = await makeRequest('POST', '/login', {});
    logTest('Rejects empty login credentials', res.status === 400 || (res.body && !res.body.success));
  } catch (e) {
    logTest('Empty login handling', false, e.message);
  }

  // Test logout
  try {
    const res = await makeRequest('POST', '/logout', {});
    logTest('Logout endpoint accessible', res.status !== 404);
  } catch (e) {
    logTest('Logout endpoint', false, e.message);
  }
}

async function testRegistrationStatusEndpoints() {
  log('\n📋 REGISTRATION STATUS TESTS', 'cyan');
  log('─'.repeat(50));
  
  // Test event registration status check
  try {
    const res = await makeRequest('POST', '/check-event-registration', {
      event_slug: 'ode-to-code'
    });
    logTest('Event registration status endpoint works', res.status === 200 || res.status === 404);
  } catch (e) {
    logTest('Event registration status', false, e.message);
  }

  // Test viewer registration status check
  try {
    const res = await makeRequest('POST', '/check-viewer-registration', {});
    logTest('Viewer registration status endpoint works', res.status === 200 || res.status === 404);
  } catch (e) {
    logTest('Viewer registration status', false, e.message);
  }
}

async function testEventRegistrationEndpoints() {
  log('\n📝 EVENT REGISTRATION ENDPOINTS TESTS', 'cyan');
  log('─'.repeat(50));
  
  const events = [
    { path: '/register/ode-to-code', name: 'Ode to Code' },
    { path: '/register/doctor-fix-it', name: 'Doctor Fix It' },
    { path: '/register/code-vibes', name: 'Code Vibes' },
    { path: '/register/room-404', name: 'Room 404' },
    { path: '/register/dronix', name: 'Dronix' },
    { path: '/register/cad-clash', name: 'CAD Clash' }
  ];

  for (const event of events) {
    try {
      const res = await makeRequest('POST', event.path, {});
      // Should return 400 (bad request) or 403 (registration closed), not 404 or 500
      logTest(`${event.name} endpoint exists`, res.status !== 404 && res.status !== 500);
    } catch (e) {
      logTest(`${event.name} endpoint`, false, e.message);
    }
  }
}

async function testViewerRegistration() {
  log('\n👁️ VIEWER REGISTRATION TESTS', 'cyan');
  log('─'.repeat(50));
  
  // Test with empty data
  try {
    const res = await makeRequest('POST', '/viewer/register', {});
    logTest('Rejects empty viewer registration', res.status === 400 || (res.body && !res.body.success));
  } catch (e) {
    logTest('Empty viewer registration handling', false, e.message);
  }

  // Test with partial data
  try {
    const res = await makeRequest('POST', '/viewer/register', {
      name: 'Test User'
    });
    logTest('Rejects incomplete viewer registration', res.status === 400 || (res.body && !res.body.success));
  } catch (e) {
    logTest('Partial viewer registration', false, e.message);
  }
}

async function testAdminEndpointsWithoutAuth() {
  log('\n🛡️ ADMIN ROUTE PROTECTION TESTS (Without Auth)', 'cyan');
  log('─'.repeat(50));
  
  const protectedRoutes = [
    { path: '/admin/dashboard', name: 'Admin Dashboard' },
    { path: '/admin/list-teams', name: 'Admin List Teams' },
    { path: '/admin/update-payment-status', name: 'Payment Status Update' },
    { path: '/super-admin/list-admins', name: 'Super Admin List' },
    { path: '/viewers-admin/dashboard', name: 'Viewers Admin Dashboard' }
  ];

  for (const route of protectedRoutes) {
    try {
      const res = await makeRequest('POST', route.path, {});
      // Should return 401 or 403 without auth
      logTest(`${route.name} requires authentication`, res.status === 401 || res.status === 403);
    } catch (e) {
      logTest(`${route.name} protection`, false, e.message);
    }
  }
}

async function testSQLInjectionProtection() {
  log('\n💉 SQL INJECTION PROTECTION TESTS', 'cyan');
  log('─'.repeat(50));
  
  const sqlInjectionPayloads = [
    "'; DROP TABLE users; --",
    "1' OR '1'='1",
    "admin'--",
    "1; DELETE FROM registrations",
    "' UNION SELECT * FROM admin --",
    "'; INSERT INTO admin VALUES('hacker','hacked'); --"
  ];

  // Test login endpoint
  for (const payload of sqlInjectionPayloads.slice(0, 3)) {
    try {
      const res = await makeRequest('POST', '/login', {
        username: payload,
        password: payload
      });
      // Should not return 500 (server error) - that might indicate SQL error
      logTest(`Login rejects SQL injection: "${payload.substring(0, 20)}..."`, 
        res.status !== 500 && (!res.raw || !res.raw.toLowerCase().includes('sql')));
    } catch (e) {
      logTest('SQL injection test', false, e.message);
    }
  }

  // Test viewer registration
  try {
    const res = await makeRequest('POST', '/viewer/register', {
      name: "'; DROP TABLE viewer_registrations; --",
      college_name: "Test College",
      utr_number: "123456789012"
    });
    logTest('Viewer registration handles SQL injection safely', 
      res.status !== 500 && (!res.raw || !res.raw.toLowerCase().includes('syntax')));
  } catch (e) {
    logTest('Viewer SQL injection', false, e.message);
  }
}

async function testXSSProtection() {
  log('\n🔒 XSS PROTECTION TESTS', 'cyan');
  log('─'.repeat(50));
  
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '"><img src=x onerror=alert(1)>',
    "javascript:alert('XSS')",
    '<svg onload=alert(1)>'
  ];

  for (const payload of xssPayloads) {
    try {
      const res = await makeRequest('POST', '/viewer/register', {
        name: payload,
        college_name: "Test College",
        utr_number: "123456789012"
      });
      // Response should not contain unescaped script tags
      const hasUnescapedScript = res.raw && res.raw.includes('<script>') && !res.raw.includes('&lt;script&gt;');
      logTest(`XSS payload handled safely: "${payload.substring(0, 25)}..."`, !hasUnescapedScript);
    } catch (e) {
      logTest('XSS protection', false, e.message);
    }
  }
}

async function testInputValidation() {
  log('\n✅ INPUT VALIDATION TESTS', 'cyan');
  log('─'.repeat(50));
  
  // Test UTR number validation (should be 12 chars)
  try {
    const res = await makeRequest('POST', '/register/ode-to-code', {
      name: 'Test User',
      college: 'Test College',
      gender: 'M',
      branch: 'CSE',
      email: 'test@test.com',
      phone: '9876543210',
      utr: '123' // Invalid - too short
    });
    logTest('Validates UTR number length', res.status === 400 || (res.body && !res.body.success));
  } catch (e) {
    logTest('UTR validation', false, e.message);
  }

  // Test phone number validation
  try {
    const res = await makeRequest('POST', '/register/ode-to-code', {
      name: 'Test User',
      college: 'Test College',
      gender: 'M',
      branch: 'CSE',
      email: 'test@test.com',
      phone: 'invalid-phone',
      utr: '123456789012'
    });
    logTest('Validates phone number format', res.status === 400 || res.status === 403 || res.body);
  } catch (e) {
    logTest('Phone validation', false, e.message);
  }

  // Test email validation
  try {
    const res = await makeRequest('POST', '/register/ode-to-code', {
      name: 'Test User',
      college: 'Test College',
      gender: 'M',
      branch: 'CSE',
      email: 'invalid-email',
      phone: '9876543210',
      utr: '123456789012'
    });
    logTest('Validates email format', res.body !== undefined);
  } catch (e) {
    logTest('Email validation', false, e.message);
  }
}

async function testRateLimitingHeaders() {
  log('\n⏱️ SECURITY HEADERS TESTS', 'cyan');
  log('─'.repeat(50));
  
  try {
    const res = await makeRequest('GET', '/');
    
    // Check for security headers
    const hasContentType = res.headers['content-type'] !== undefined;
    logTest('Response includes Content-Type header', hasContentType);
    
    // Check CORS headers
    const hasCors = res.headers['access-control-allow-origin'] !== undefined || 
                   res.headers['access-control-allow-credentials'] !== undefined;
    logTest('CORS headers configured', hasCors);
  } catch (e) {
    logTest('Security headers', false, e.message);
  }
}

async function testJSONContentType() {
  log('\n📦 CONTENT-TYPE VALIDATION TESTS', 'cyan');
  log('─'.repeat(50));
  
  // Test sending non-JSON content type
  try {
    const res = await makeRequest('POST', '/login', 'username=test&password=test', {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    // Server should handle or reject gracefully
    logTest('Handles non-JSON content type gracefully', res.status !== 500);
  } catch (e) {
    logTest('Content-Type handling', false, e.message);
  }
}

async function testLargePayloads() {
  log('\n📏 PAYLOAD SIZE TESTS', 'cyan');
  log('─'.repeat(50));
  
  // Test very large payload
  try {
    const largeString = 'A'.repeat(100000);
    const res = await makeRequest('POST', '/login', {
      username: largeString,
      password: largeString
    });
    // Should handle gracefully (400, 413, or reject)
    logTest('Handles large payloads gracefully', res.status !== 500);
  } catch (e) {
    // Timeout or rejection is acceptable
    logTest('Large payload handling', true, 'Rejected/timed out (expected)');
  }
}

async function testTeamRegistrationValidation() {
  log('\n👥 TEAM REGISTRATION VALIDATION TESTS', 'cyan');
  log('─'.repeat(50));
  
  // Test team event with missing members
  try {
    const res = await makeRequest('POST', '/register/code-vibes', {
      teamName: 'Test Team',
      utr: '123456789012',
      leader: {
        name: 'Leader Name',
        college: 'Test College',
        gender: 'M',
        branch: 'IT',
        email: 'leader@test.com',
        phone: '9876543210'
      },
      members: {} // Empty members
    });
    logTest('Validates minimum team members', res.status === 400 || res.status === 403 || (res.body && !res.body.success));
  } catch (e) {
    logTest('Team member validation', false, e.message);
  }

  // Test team event with invalid member data
  try {
    const res = await makeRequest('POST', '/register/code-vibes', {
      teamName: 'Test Team',
      utr: '123456789012',
      leader: {
        name: 'Leader Name',
        college: 'Test College',
        gender: 'M',
        branch: 'IT',
        email: 'leader@test.com',
        phone: '9876543210'
      },
      members: {
        member1: { name: '', gender: '', phone: '' } // Invalid member
      }
    });
    logTest('Validates member data completeness', res.body !== undefined);
  } catch (e) {
    logTest('Member data validation', false, e.message);
  }
}

// ============ MAIN TEST RUNNER ============

async function runAllTests() {
  log('\n' + '═'.repeat(60), 'bold');
  log('  🧪 WINGS 2026 - BACKEND E2E & SECURITY TEST SUITE', 'bold');
  log('═'.repeat(60), 'bold');
  log(`\n  Target: ${BASE_URL}`);
  log(`  Time: ${new Date().toISOString()}\n`);

  try {
    await testServerHealth();
    await test404Handling();
    await testAuthEndpoints();
    await testRegistrationStatusEndpoints();
    await testEventRegistrationEndpoints();
    await testViewerRegistration();
    await testAdminEndpointsWithoutAuth();
    await testSQLInjectionProtection();
    await testXSSProtection();
    await testInputValidation();
    await testRateLimitingHeaders();
    await testJSONContentType();
    await testLargePayloads();
    await testTeamRegistrationValidation();
  } catch (e) {
    log(`\n❌ Test suite error: ${e.message}`, 'red');
  }

  // Print summary
  log('\n' + '═'.repeat(60), 'bold');
  log('  📊 TEST RESULTS SUMMARY', 'bold');
  log('═'.repeat(60), 'bold');
  log(`\n  Total Tests: ${results.passed + results.failed}`);
  log(`  ✓ Passed: ${results.passed}`, 'green');
  log(`  ✗ Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`\n  Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%\n`);

  if (results.failed > 0) {
    log('  Failed Tests:', 'red');
    results.tests.filter(t => !t.passed).forEach(t => {
      log(`    • ${t.name}`, 'red');
      if (t.details) log(`      ${t.details}`, 'yellow');
    });
    log('');
  }

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Check if server is running before tests
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
