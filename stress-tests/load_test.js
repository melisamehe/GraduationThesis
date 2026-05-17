import http from 'k6/http';
import { check, sleep } from 'k6';

// Run with: k6 run load_test.js
// Set environment variables for the target URLs:
// k6 run -e API_URL=https://mels-store-api.onrender.com -e AI_URL=https://mels-store-ai-service.onrender.com load_test.js

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Rampa up to 20 users
    { duration: '1m', target: 50 },  // Stay at 50 users
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  },
};

const API_URL = __ENV.API_URL || 'http://localhost:5000/api';
const AI_URL = __ENV.AI_URL || 'http://localhost:8000';

export default function () {
  // Test 1: Fetch all products (Main Node.js API)
  let productsRes = http.get(`${API_URL}/products/get-all`);
  check(productsRes, {
    'Products fetched successfully': (r) => r.status === 200,
  });

  sleep(1);

  // Test 2: Fetch trending recommendations (Python AI Service)
  let aiRes = http.get(`${AI_URL}/recommendations/trending?limit=4`);
  check(aiRes, {
    'Recommendations fetched successfully': (r) => r.status === 200,
  });

  sleep(2);
}
