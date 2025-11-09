#!/usr/bin/env python3

"""
Simple test script to verify the presentation evaluator setup
"""

import os
import sys

def test_imports():
    """Test if all required modules can be imported"""
    try:
        import flask
        from flask_cors import CORS
        import openai
        import PyPDF2
        from pptx import Presentation
        import speech_recognition as sr
        import websockets
        from dotenv import load_dotenv
        
        print("✅ All required modules are available")
        return True
    except ImportError as e:
        print(f"❌ Missing module: {e}")
        return False

def test_file_structure():
    """Test if all required files and directories exist"""
    required_files = [
        'app.py',
        'presentation_evaluator.py',
        'database.py',
        'requirements.txt',
        '.env.example',
        'templates/index.html',
        'static/app.js'
    ]
    
    required_dirs = [
        'uploads',
        'data',
        'static',
        'templates'
    ]
    
    missing_files = []
    missing_dirs = []
    
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    for dir in required_dirs:
        if not os.path.exists(dir):
            missing_dirs.append(dir)
    
    if missing_files:
        print(f"❌ Missing files: {missing_files}")
        return False
    
    if missing_dirs:
        print(f"❌ Missing directories: {missing_dirs}")
        return False
    
    print("✅ All required files and directories exist")
    return True

def test_classes():
    """Test if classes can be instantiated"""
    try:
        from database import Database
        from presentation_evaluator import PresentationEvaluator
        
        # Test database
        db = Database()
        print("✅ Database class can be instantiated")
        
        # Test presentation evaluator (without OpenAI client)
        class MockClient:
            pass
        
        evaluator = PresentationEvaluator(MockClient())
        print("✅ PresentationEvaluator class can be instantiated")
        
        return True
    except Exception as e:
        print(f"❌ Class instantiation failed: {e}")
        return False

def main():
    print("🔍 Testing Presentation Evaluator Setup...")
    print("=" * 50)
    
    tests = [
        ("File Structure", test_file_structure),
        ("Import Modules", test_imports),
        ("Class Instantiation", test_classes)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Testing {test_name}...")
        if test_func():
            passed += 1
        else:
            print(f"❌ {test_name} test failed")
    
    print("\n" + "=" * 50)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The application is ready to run.")
        print("\nTo start the application:")
        print("1. Add your OpenAI API key to .env file")
        print("2. Run: python app.py")
        print("3. Open http://localhost:5000")
    else:
        print("⚠️  Some tests failed. Please check the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    main()