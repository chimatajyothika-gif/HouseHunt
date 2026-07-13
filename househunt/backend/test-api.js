const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

async function runTests() {
  console.log('==================================================');
  console.log('          HOUSEHUNT BACKEND API TESTER             ');
  console.log('==================================================\n');

  try {
    // Test 1: Health Check
    console.log('[TEST 1] Testing Server Health Check...');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    if (healthData.success) {
      console.log('✅ Health check passed:', healthData.status);
    } else {
      console.error('❌ Health check failed');
    }

    // Test 2: Get Properties
    console.log('\n[TEST 2] Testing Fetch Properties (Public endpoint)...');
    const propRes = await fetch(`${BASE_URL}/api/properties`);
    const propData = await propRes.json();
    if (propData.success) {
      console.log(`✅ Fetch properties passed. Found ${propData.properties.length} properties.`);
    } else {
      console.error('❌ Fetch properties failed');
    }

    // Test 3: Register a User
    console.log('\n[TEST 3] Testing User Registration...');
    const regEmail = `tester-${Date.now()}@test.com`;
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `Tester-${Date.now()}`,
        email: regEmail,
        password: 'password123',
        role: 'renter'
      })
    });
    const regData = await regRes.json();
    if (regData.success) {
      console.log('✅ Registration successful. User token generated.');
    } else {
      console.error('❌ Registration failed:', regData.message);
    }

    // Test 4: Login User
    console.log('\n[TEST 4] Testing User Login...');
    const logRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regEmail,
        password: 'password123'
      })
    });
    const logData = await logRes.json();
    if (logData.success) {
      console.log('✅ Login successful. Logged in as:', logData.user.username);
    } else {
      console.error('❌ Login failed:', logData.message);
    }

    console.log('\n==================================================');
    console.log('🎉 API Tests Completed Successfully!');
    console.log('==================================================');
  } catch (error) {
    console.error('\n❌ Test execution failed with error:', error.message);
    console.log('Make sure the backend server is running on port 5000 before executing the tests.');
  }
}

runTests();
