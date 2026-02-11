#!/usr/bin/env python3
"""
Test script to verify logging system is working correctly.
Run this to ensure logs are being written to files.
"""

import sys
import os
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from utils.logger import (
    app_logger,
    db_logger,
    auth_logger,
    error_logger,
    api_logger,
    log_exception
)


def test_basic_logging():
    """Test basic logging functionality."""
    print("\n" + "="*60)
    print("Testing Basic Logging")
    print("="*60 + "\n")
    
    app_logger.debug("This is a DEBUG message")
    app_logger.info("This is an INFO message")
    app_logger.warning("This is a WARNING message")
    app_logger.error("This is an ERROR message")
    app_logger.critical("This is a CRITICAL message")
    
    print("✅ Basic logging test completed")


def test_component_loggers():
    """Test different component loggers."""
    print("\n" + "="*60)
    print("Testing Component Loggers")
    print("="*60 + "\n")
    
    db_logger.info("Database logger test - connection established")
    db_logger.debug("Database logger test - executing query")
    
    auth_logger.info("Auth logger test - user login successful")
    auth_logger.warning("Auth logger test - failed login attempt")
    
    api_logger.info("API logger test - GET /api/users - Status: 200")
    api_logger.debug("API logger test - request headers logged")
    
    error_logger.error("Error logger test - simulated error")
    
    print("✅ Component loggers test completed")


def test_exception_logging():
    """Test exception logging with traceback."""
    print("\n" + "="*60)
    print("Testing Exception Logging")
    print("="*60 + "\n")
    
    try:
        # Simulate an error
        result = 1 / 0
    except Exception as e:
        log_exception(app_logger, e, context="Testing exception logging")
        print("✅ Exception logged with full traceback")


def test_log_files_created():
    """Verify log files were created."""
    print("\n" + "="*60)
    print("Verifying Log Files")
    print("="*60 + "\n")
    
    logs_dir = Path(__file__).parent / "logs"
    
    expected_files = [
        "app.log",
        "database.log",
        "auth.log",
        "errors.log",
        "api.log"
    ]
    
    print(f"Checking logs directory: {logs_dir}\n")
    
    all_exist = True
    for log_file in expected_files:
        log_path = logs_dir / log_file
        if log_path.exists():
            size = log_path.stat().st_size
            print(f"✅ {log_file} - {size} bytes")
        else:
            print(f"❌ {log_file} - NOT FOUND")
            all_exist = False
    
    print()
    if all_exist:
        print("✅ All log files created successfully")
    else:
        print("❌ Some log files are missing")
    
    return all_exist


def test_log_content():
    """Verify logs contain expected content."""
    print("\n" + "="*60)
    print("Verifying Log Content")
    print("="*60 + "\n")
    
    logs_dir = Path(__file__).parent / "logs"
    app_log = logs_dir / "app.log"
    
    if not app_log.exists():
        print("❌ app.log not found")
        return False
    
    with open(app_log, 'r') as f:
        content = f.read()
    
    checks = [
        ("DEBUG message", "DEBUG"),
        ("INFO message", "INFO"),
        ("WARNING message", "WARNING"),
        ("ERROR message", "ERROR"),
    ]
    
    all_found = True
    for check_name, check_text in checks:
        if check_text in content:
            print(f"✅ Found {check_name}")
        else:
            print(f"❌ Missing {check_name}")
            all_found = False
    
    print()
    if all_found:
        print("✅ Log content verification passed")
    else:
        print("❌ Some expected content missing from logs")
    
    return all_found


def main():
    """Run all logging tests."""
    print("\n" + "="*60)
    print("LOGGING SYSTEM TEST")
    print("="*60)
    
    # Run tests
    test_basic_logging()
    test_component_loggers()
    test_exception_logging()
    
    # Verify results
    files_ok = test_log_files_created()
    content_ok = test_log_content()
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60 + "\n")
    
    if files_ok and content_ok:
        print("✅ All tests passed!")
        print("\nYou can view the logs with:")
        print("  tail -f backend/logs/app.log")
        print("  tail -f backend/logs/errors.log")
        print("\nOr view all logs:")
        print("  ls -lh backend/logs/")
        return 0
    else:
        print("❌ Some tests failed")
        print("\nPlease check:")
        print("  1. Logs directory exists and is writable")
        print("  2. No permission errors")
        print("  3. Sufficient disk space")
        return 1


if __name__ == "__main__":
    sys.exit(main())

