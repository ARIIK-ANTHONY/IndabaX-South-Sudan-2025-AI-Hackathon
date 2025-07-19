#!/usr/bin/env python3
"""
API Test Suite for Blood Disease Classification API
Run with: python test-api.py
"""

import requests
import json
import time
import websocket
import threading
from typing import Dict, Any, Optional

class APITester:
    def __init__(self, base_url: str = "http://localhost:5000/api"):
        self.base_url = base_url
        self.session_id: Optional[str] = None
        self.results = []

    def run_test(self, name: str, test_func):
        """Run a single test and record results"""
        print(f"\n🧪 Testing: {name}")
        print("─" * 50)
        
        try:
            result = test_func()
            print("✅ PASSED")
            print(f"Response: {json.dumps(result, indent=2)}")
            self.results.append({"name": name, "status": "PASSED", "result": result})
        except Exception as error:
            print("❌ FAILED")
            print(f"Error: {str(error)}")
            self.results.append({"name": name, "status": "FAILED", "error": str(error)})

    def test_health_check(self) -> Dict[str, Any]:
        """Test health check endpoint"""
        response = requests.get(f"{self.base_url}/health")
        response.raise_for_status()
        return response.json()

    def test_prediction(self) -> Dict[str, Any]:
        """Test blood disease prediction endpoint"""
        payload = {
            "glucose": 120,
            "hemoglobin": 14.5,
            "platelets": 250000,
            "cholesterol": 180,
            "wbc": 7000,
            "hematocrit": 42
        }
        
        response = requests.post(
            f"{self.base_url}/predict",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        return response.json()

    def test_live_metrics(self) -> Dict[str, Any]:
        """Test live metrics endpoint"""
        response = requests.get(f"{self.base_url}/live-metrics")
        response.raise_for_status()
        return response.json()

    def test_recent_predictions(self) -> Dict[str, Any]:
        """Test recent predictions endpoint"""
        response = requests.get(f"{self.base_url}/recent-predictions?limit=5")
        response.raise_for_status()
        return response.json()

    def test_disease_distribution(self) -> Dict[str, Any]:
        """Test disease distribution endpoint"""
        response = requests.get(f"{self.base_url}/disease-distribution")
        response.raise_for_status()
        return response.json()

    def test_statistics(self) -> Dict[str, Any]:
        """Test statistics endpoint"""
        response = requests.get(f"{self.base_url}/stats")
        response.raise_for_status()
        return response.json()

    def test_chat_session(self) -> Dict[str, Any]:
        """Test chat session creation"""
        response = requests.post(
            f"{self.base_url}/chatbot/session",
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        result = response.json()
        
        if result.get("success") and result.get("data", {}).get("sessionId"):
            self.session_id = result["data"]["sessionId"]
            print(f"📝 Session ID saved: {self.session_id}")
        
        return result

    def test_chat_message(self) -> Dict[str, Any]:
        """Test sending chat message"""
        if not self.session_id:
            raise Exception("No session ID available. Run chat session test first.")
        
        payload = {
            "sessionId": self.session_id,
            "message": "What are the symptoms of diabetes?"
        }
        
        response = requests.post(
            f"{self.base_url}/chatbot/message",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        return response.json()

    def test_chat_history(self) -> Dict[str, Any]:
        """Test chat history retrieval"""
        if not self.session_id:
            raise Exception("No session ID available. Run chat session test first.")
        
        response = requests.get(f"{self.base_url}/chatbot/history?sessionId={self.session_id}")
        response.raise_for_status()
        return response.json()

    def test_websocket(self) -> Dict[str, Any]:
        """Test WebSocket connection"""
        result = {"status": "failed", "message": ""}
        
        def on_message(ws, message):
            print(f"📨 Received: {message}")
            result["message"] = message
            ws.close()
        
        def on_open(ws):
            print("🔌 WebSocket connection established")
            result["status"] = "connected"
            # Close after 2 seconds if no message received
            threading.Timer(2.0, lambda: ws.close()).start()
        
        def on_error(ws, error):
            print(f"❌ WebSocket error: {error}")
            result["status"] = "error"
            result["message"] = str(error)
        
        try:
            ws = websocket.WebSocketApp(
                "ws://localhost:5000/live-updates",
                on_message=on_message,
                on_open=on_open,
                on_error=on_error
            )
            ws.run_forever()
            
            if result["status"] == "connected":
                result["message"] = "WebSocket working"
                
        except Exception as e:
            result["status"] = "error"
            result["message"] = str(e)
        
        return result

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting API Test Suite")
        print("=" * 50)
        
        # Core API Tests
        self.run_test("Health Check", self.test_health_check)
        self.run_test("Blood Disease Prediction", self.test_prediction)
        self.run_test("Live Metrics", self.test_live_metrics)
        self.run_test("Recent Predictions", self.test_recent_predictions)
        self.run_test("Disease Distribution", self.test_disease_distribution)
        self.run_test("Statistics", self.test_statistics)
        
        # Chatbot Tests
        self.run_test("Chat Session Creation", self.test_chat_session)
        self.run_test("Chat Message", self.test_chat_message)
        self.run_test("Chat History", self.test_chat_history)
        
        # WebSocket Test
        self.run_test("WebSocket Connection", self.test_websocket)
        
        self.print_summary()

    def print_summary(self):
        """Print test results summary"""
        print("\n📊 Test Summary")
        print("=" * 50)
        
        passed = len([r for r in self.results if r["status"] == "PASSED"])
        failed = len([r for r in self.results if r["status"] == "FAILED"])
        
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed / len(self.results) * 100):.1f}%")
        
        if failed > 0:
            print("\n❌ Failed Tests:")
            for result in self.results:
                if result["status"] == "FAILED":
                    print(f"  - {result['name']}: {result['error']}")

if __name__ == "__main__":
    try:
        tester = APITester()
        tester.run_all_tests()
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
    except Exception as e:
        print(f"\n❌ Test suite error: {e}")
