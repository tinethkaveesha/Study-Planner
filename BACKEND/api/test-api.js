/**
 * Test Utility Script
 * 
 * This script helps you test the backend API endpoints manually
 * Run with: node test-api.js
 * 
 * Make sure your server is running on http://localhost:5000
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';
const FIREBASE_TOKEN = process.env.TEST_FIREBASE_TOKEN || '';

console.log('='.repeat(50));
console.log('Backend API Test Utility');
console.log('='.repeat(50));
console.log(`Base URL: ${BASE_URL}`);
console.log(`Firebase Token: ${FIREBASE_TOKEN ? 'Set ✓' : 'Not set ✗'}`);
console.log('='.repeat(50));

// Helper function to make HTTP requests
function makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const isHttps = url.protocol === 'https:';
        const lib = isHttps ? https : http;

        const reqOptions = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const req = lib.request(url, reqOptions, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: jsonData
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: data
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

// Test functions
async function testHealthEndpoint() {
    console.log('\n1. Testing Health Endpoint...');
    console.log('   GET /health');
    
    try {
        const response = await makeRequest('/health');
        console.log(`   Status: ${response.status}`);
        console.log('   Response:', JSON.stringify(response.data, null, 2));
        return response.status === 200;
    } catch (error) {
        console.error('   Error:', error.message);
        return false;
    }
}

async function testRootEndpoint() {
    console.log('\n2. Testing Root Endpoint...');
    console.log('   GET /');
    
    try {
        const response = await makeRequest('/');
        console.log(`   Status: ${response.status}`);
        console.log('   Response:', JSON.stringify(response.data, null, 2));
        return response.status === 200;
    } catch (error) {
        console.error('   Error:', error.message);
        return false;
    }
}

async function testUnauthorizedSubscription() {
    console.log('\n3. Testing Subscription Endpoint (No Auth - Should Fail)...');
    console.log('   GET /api/stripeAPI/subscription');
    
    try {
        const response = await makeRequest('/api/stripeAPI/subscription');
        console.log(`   Status: ${response.status}`);
        console.log('   Response:', JSON.stringify(response.data, null, 2));
        return response.status === 401;
    } catch (error) {
        console.error('   Error:', error.message);
        return false;
    }
}

async function testAuthorizedSubscription() {
    if (!FIREBASE_TOKEN) {
        console.log('\n4. Skipping Authorized Subscription Test (No token provided)');
        console.log('   Set TEST_FIREBASE_TOKEN environment variable to test');
        return null;
    }

    console.log('\n4. Testing Subscription Endpoint (With Auth)...');
    console.log('   GET /api/stripeAPI/subscription');
    
    try {
        const response = await makeRequest('/api/stripeAPI/subscription', {
            headers: {
                'Authorization': `Bearer ${FIREBASE_TOKEN}`
            }
        });
        console.log(`   Status: ${response.status}`);
        console.log('   Response:', JSON.stringify(response.data, null, 2));
        return response.status === 200;
    } catch (error) {
        console.error('   Error:', error.message);
        return false;
    }
}

async function testNotFoundEndpoint() {
    console.log('\n5. Testing 404 Handler...');
    console.log('   GET /nonexistent');
    
    try {
        const response = await makeRequest('/nonexistent');
        console.log(`   Status: ${response.status}`);
        console.log('   Response:', JSON.stringify(response.data, null, 2));
        return response.status === 404;
    } catch (error) {
        console.error('   Error:', error.message);
        return false;
    }
}

async function testCORS() {
    console.log('\n6. Testing CORS Headers...');
    console.log('   GET /health with Origin header');
    
    try {
        const response = await makeRequest('/health', {
            headers: {
                'Origin': 'http://localhost:5173'
            }
        });
        console.log(`   Status: ${response.status}`);
        console.log('   CORS Headers:');
        console.log(`     Access-Control-Allow-Origin: ${response.headers['access-control-allow-origin'] || 'Not set'}`);
        console.log(`     Access-Control-Allow-Credentials: ${response.headers['access-control-allow-credentials'] || 'Not set'}`);
        return response.headers['access-control-allow-origin'] !== undefined;
    } catch (error) {
        console.error('   Error:', error.message);
        return false;
    }
}

// Run all tests
async function runTests() {
    const results = {
        passed: 0,
        failed: 0,
        skipped: 0
    };

    const tests = [
        testHealthEndpoint,
        testRootEndpoint,
        testUnauthorizedSubscription,
        testAuthorizedSubscription,
        testNotFoundEndpoint,
        testCORS
    ];

    for (const test of tests) {
        const result = await test();
        if (result === true) results.passed++;
        else if (result === false) results.failed++;
        else results.skipped++;
    }

    console.log('\n' + '='.repeat(50));
    console.log('Test Results Summary');
    console.log('='.repeat(50));
    console.log(`Passed:  ${results.passed}`);
    console.log(`Failed:  ${results.failed}`);
    console.log(`Skipped: ${results.skipped}`);
    console.log('='.repeat(50));

    if (results.failed > 0) {
        console.log('\n⚠️  Some tests failed. Check the output above for details.');
        process.exit(1);
    } else if (results.skipped > 0) {
        console.log('\n✓ All active tests passed!');
        console.log('💡 Tip: Set TEST_FIREBASE_TOKEN to run authenticated tests');
        process.exit(0);
    } else {
        console.log('\n✓ All tests passed!');
        process.exit(0);
    }
}

// Run tests if executed directly
if (require.main === module) {
    runTests().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { makeRequest, runTests };
