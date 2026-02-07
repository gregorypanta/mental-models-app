#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime
import uuid

class AIBooksAPITester:
    def __init__(self, base_url="https://mindcraft-50.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.journal_entries_created = []

    def run_test(self, name, method, endpoint, expected_status, data=None, expected_keys=None):
        """Run a single API test with detailed validation"""
        url = f"{self.api_base}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Additional validation for JSON responses
                if response.status_code in [200, 201]:
                    try:
                        response_data = response.json()
                        
                        # Check expected keys if provided
                        if expected_keys and isinstance(response_data, dict):
                            for key in expected_keys:
                                if key not in response_data:
                                    print(f"⚠️  Warning: Expected key '{key}' not found in response")
                        
                        # Show response size/type for debugging
                        if isinstance(response_data, list):
                            print(f"   Response: List with {len(response_data)} items")
                        elif isinstance(response_data, dict):
                            print(f"   Response: Object with keys: {list(response_data.keys())}")
                            
                        return success, response_data
                    except json.JSONDecodeError:
                        print(f"⚠️  Warning: Response is not valid JSON")
                        return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_body = response.json()
                    print(f"   Error: {error_body}")
                except:
                    print(f"   Error: {response.text[:200]}")

            return success, response.json() if response.status_code in [200, 201] else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timed out")
            return False, {}
        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API", "GET", "", 200, expected_keys=["message"])

    def test_get_sections(self):
        """Test getting all sections"""
        success, response = self.run_test("Get Sections", "GET", "sections", 200)
        if success and isinstance(response, list):
            if len(response) == 6:
                print(f"   ✅ Correct number of sections: {len(response)}")
            else:
                print(f"   ⚠️  Expected 6 sections, got {len(response)}")
        return success

    def test_get_all_models(self):
        """Test getting all models"""
        success, response = self.run_test("Get All Models", "GET", "models", 200)
        if success and isinstance(response, list):
            if len(response) >= 200:
                print(f"   ✅ Good number of models: {len(response)}")
            else:
                print(f"   ⚠️  Expected 200+ models, got {len(response)}")
        return success

    def test_get_models_by_section(self):
        """Test filtering models by section"""
        success, response = self.run_test(
            "Get Models by Section", "GET", "models?section=thinking-smarter", 200
        )
        if success and isinstance(response, list):
            if len(response) >= 30:
                print(f"   ✅ Good number of thinking-smarter models: {len(response)}")
            else:
                print(f"   ⚠️  Expected 30+ models for thinking-smarter, got {len(response)}")
        return success

    def test_search_models(self):
        """Test searching models"""
        success, response = self.run_test(
            "Search Models", "GET", "models?search=inversion", 200
        )
        if success and isinstance(response, list):
            if len(response) > 0:
                print(f"   ✅ Found search results: {len(response)} models")
                # Check if the results actually contain 'inversion'
                contains_inversion = any('inversion' in str(model).lower() for model in response)
                if contains_inversion:
                    print(f"   ✅ Search results contain 'inversion' keyword")
                else:
                    print(f"   ⚠️  Search results don't contain 'inversion' keyword")
            else:
                print(f"   ⚠️  No search results found for 'inversion'")
        return success

    def test_get_specific_model(self):
        """Test getting a specific model"""
        success, response = self.run_test(
            "Get Specific Model", "GET", "models/thinking-smarter/1", 200,
            expected_keys=["title", "explanation", "example", "ai_prompt"]
        )
        if success and isinstance(response, dict):
            if "First Principles Thinking" in response.get("title", ""):
                print(f"   ✅ Correct model title: {response.get('title')}")
            else:
                print(f"   ⚠️  Expected 'First Principles Thinking', got: {response.get('title')}")
        return success

    def test_journal_operations(self):
        """Test journal CRUD operations"""
        print(f"\n📝 Testing Journal Operations...")
        
        # Test creating a journal entry
        test_entry = {
            "content": f"Test journal entry created at {datetime.now().isoformat()}",
            "model_title": "First Principles Thinking",
            "section_slug": "thinking-smarter"
        }
        
        success, create_response = self.run_test(
            "Create Journal Entry", "POST", "journal", 201, data=test_entry,
            expected_keys=["id", "content", "created_at"]
        )
        
        entry_id = None
        if success and isinstance(create_response, dict):
            entry_id = create_response.get("id")
            self.journal_entries_created.append(entry_id)
            print(f"   ✅ Created entry with ID: {entry_id}")
        
        # Test getting journal entries
        success2, get_response = self.run_test(
            "Get Journal Entries", "GET", "journal", 200
        )
        
        if success2 and isinstance(get_response, list):
            print(f"   ✅ Retrieved {len(get_response)} journal entries")
        
        # Test deleting the created entry
        if entry_id:
            success3, _ = self.run_test(
                "Delete Journal Entry", "DELETE", f"journal/{entry_id}", 200
            )
            if success3:
                print(f"   ✅ Successfully deleted entry {entry_id}")
        
        return success and success2 and (success3 if entry_id else True)

    def test_introduction_endpoint(self):
        """Test getting introduction content"""
        return self.run_test("Get Introduction", "GET", "introduction", 200)

    def test_conclusion_endpoint(self):
        """Test getting conclusion content"""
        return self.run_test("Get Conclusion", "GET", "conclusion", 200)

    def cleanup(self):
        """Clean up any test data"""
        for entry_id in self.journal_entries_created:
            try:
                requests.delete(f"{self.api_base}/journal/{entry_id}", timeout=10)
                print(f"🧹 Cleaned up journal entry: {entry_id}")
            except:
                pass

def main():
    print("🚀 Starting AI-Powered Mind API Testing...")
    print("=" * 60)
    
    tester = AIBooksAPITester()
    
    try:
        # Test all endpoints
        tester.test_root_endpoint()
        tester.test_get_sections()
        tester.test_get_all_models()
        tester.test_get_models_by_section()
        tester.test_search_models()
        tester.test_get_specific_model()
        tester.test_journal_operations()
        tester.test_introduction_endpoint()
        tester.test_conclusion_endpoint()
        
    finally:
        # Cleanup
        tester.cleanup()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 API Testing Results:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())