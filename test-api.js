// API Test Suite for Blood Disease Classification API
// Run with: node test-api.js

const BASE_URL = 'http://localhost:5000/api';

class APITester {
  constructor() {
    this.results = [];
    this.sessionId = null;
  }

  async runTest(name, testFunction) {
    console.log(`\n🧪 Testing: ${name}`);
    console.log('─'.repeat(50));
    
    try {
      const result = await testFunction();
      console.log('✅ PASSED');
      console.log('Response:', JSON.stringify(result, null, 2));
      this.results.push({ name, status: 'PASSED', result });
    } catch (error) {
      console.log('❌ FAILED');
      console.error('Error:', error.message);
      this.results.push({ name, status: 'FAILED', error: error.message });
    }
  }

  async testHealthCheck() {
    const response = await fetch(`${BASE_URL}/health`);
    return await response.json();
  }

  async testPrediction() {
    const response = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        glucose: 120,
        hemoglobin: 14.5,
        platelets: 250000,
        cholesterol: 180,
        wbc: 7000,
        hematocrit: 42
      })
    });
    return await response.json();
  }

  async testLiveMetrics() {
    const response = await fetch(`${BASE_URL}/live-metrics`);
    return await response.json();
  }

  async testRecentPredictions() {
    const response = await fetch(`${BASE_URL}/recent-predictions?limit=5`);
    return await response.json();
  }

  async testDiseaseDistribution() {
    const response = await fetch(`${BASE_URL}/disease-distribution`);
    return await response.json();
  }

  async testStatistics() {
    const response = await fetch(`${BASE_URL}/stats`);
    return await response.json();
  }

  async testChatSession() {
    const response = await fetch(`${BASE_URL}/chatbot/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const result = await response.json();
    
    if (result.success && result.data.sessionId) {
      this.sessionId = result.data.sessionId;
      console.log(`📝 Session ID saved: ${this.sessionId}`);
    }
    
    return result;
  }

  async testChatMessage() {
    if (!this.sessionId) {
      throw new Error('No session ID available. Run chat session test first.');
    }

    const response = await fetch(`${BASE_URL}/chatbot/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: this.sessionId,
        message: 'What are the symptoms of diabetes?'
      })
    });
    return await response.json();
  }

  async testChatHistory() {
    if (!this.sessionId) {
      throw new Error('No session ID available. Run chat session test first.');
    }

    const response = await fetch(`${BASE_URL}/chatbot/history?sessionId=${this.sessionId}`);
    return await response.json();
  }

  async testWebSocket() {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket('ws://localhost:5000/live-updates');
      
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('WebSocket connection timeout'));
      }, 5000);

      ws.onopen = () => {
        console.log('🔌 WebSocket connection established');
        clearTimeout(timeout);
        ws.close();
        resolve({ status: 'connected', message: 'WebSocket working' });
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        reject(new Error(`WebSocket error: ${error.message}`));
      };

      ws.onmessage = (event) => {
        console.log('📨 Received:', event.data);
      };
    });
  }

  async runAllTests() {
    console.log('🚀 Starting API Test Suite');
    console.log('=' .repeat(50));

    // Core API Tests
    await this.runTest('Health Check', () => this.testHealthCheck());
    await this.runTest('Blood Disease Prediction', () => this.testPrediction());
    await this.runTest('Live Metrics', () => this.testLiveMetrics());
    await this.runTest('Recent Predictions', () => this.testRecentPredictions());
    await this.runTest('Disease Distribution', () => this.testDiseaseDistribution());
    await this.runTest('Statistics', () => this.testStatistics());

    // Chatbot Tests
    await this.runTest('Chat Session Creation', () => this.testChatSession());
    await this.runTest('Chat Message', () => this.testChatMessage());
    await this.runTest('Chat History', () => this.testChatHistory());

    // WebSocket Test (if available)
    if (typeof WebSocket !== 'undefined') {
      await this.runTest('WebSocket Connection', () => this.testWebSocket());
    } else {
      console.log('\n⚠️  WebSocket test skipped (not available in Node.js)');
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 Test Summary');
    console.log('=' .repeat(50));
    
    const passed = this.results.filter(r => r.status === 'PASSED').length;
    const failed = this.results.filter(r => r.status === 'FAILED').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / this.results.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAILED')
        .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
    }
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ with fetch support');
  console.log('Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

// Run the tests
const tester = new APITester();
tester.runAllTests().catch(console.error);
