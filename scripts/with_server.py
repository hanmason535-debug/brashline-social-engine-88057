#!/usr/bin/env python3
"""
Server Runner with Test Execution
Based on Anthropic's webapp-testing skill patterns.

Starts the dev server, waits for it to be ready, runs a command, then cleans up.

Usage:
    # Run Playwright tests
    python scripts/with_server.py --server "npm run dev" --port 8080 -- npx playwright test

    # Run element discovery
    python scripts/with_server.py --server "npm run dev" --port 8080 -- python scripts/discover-elements.py

    # Run custom script
    python scripts/with_server.py --server "npm run dev" --port 8080 -- node my-script.js
"""

import argparse
import subprocess
import socket
import time
import signal
import sys
import os


def wait_for_port(port: int, host: str = "localhost", timeout: int = 60) -> bool:
    """Wait for a port to become available."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            with socket.create_connection((host, port), timeout=1):
                return True
        except (socket.timeout, ConnectionRefusedError, OSError):
            time.sleep(0.5)
    return False


def main():
    parser = argparse.ArgumentParser(
        description="Run command with dev server",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    # Run Playwright tests
    python scripts/with_server.py --server "npm run dev" --port 8080 -- npx playwright test

    # Run in headed mode for debugging  
    python scripts/with_server.py --server "npm run dev" --port 8080 -- npx playwright test --headed

    # Discover elements
    python scripts/with_server.py --server "npm run dev" --port 8080 -- python scripts/discover-elements.py
        """
    )
    
    parser.add_argument(
        "--server",
        required=True,
        help="Command to start the server (e.g., 'npm run dev')"
    )
    parser.add_argument(
        "--port",
        type=int,
        required=True,
        help="Port to wait for (e.g., 8080)"
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=60,
        help="Timeout in seconds to wait for server (default: 60)"
    )
    parser.add_argument(
        "--host",
        default="localhost",
        help="Host to check (default: localhost)"
    )
    parser.add_argument(
        "command",
        nargs=argparse.REMAINDER,
        help="Command to run after server is ready"
    )
    
    args = parser.parse_args()
    
    # Remove leading '--' if present
    command = args.command
    if command and command[0] == "--":
        command = command[1:]
    
    if not command:
        print("❌ No command specified to run")
        print("   Usage: python scripts/with_server.py --server 'npm run dev' --port 8080 -- <command>")
        sys.exit(1)
    
    server_process = None
    result_code = 1
    
    try:
        # Start the server
        print(f"🚀 Starting server: {args.server}")
        
        # Use shell=True on Windows for npm commands
        server_process = subprocess.Popen(
            args.server,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            cwd=os.getcwd()
        )
        
        # Wait for the server to be ready
        print(f"⏳ Waiting for port {args.port} (timeout: {args.timeout}s)...")
        
        if not wait_for_port(args.port, args.host, args.timeout):
            print(f"❌ Server failed to start within {args.timeout}s")
            sys.exit(1)
        
        print(f"✅ Server ready on port {args.port}")
        
        # Give it a moment to stabilize
        time.sleep(1)
        
        # Run the command
        print(f"\n🏃 Running: {' '.join(command)}\n")
        print("=" * 60)
        
        result = subprocess.run(
            command,
            shell=True if len(command) == 1 else False,
            cwd=os.getcwd()
        )
        
        result_code = result.returncode
        
        print("=" * 60)
        if result_code == 0:
            print(f"✅ Command completed successfully")
        else:
            print(f"❌ Command failed with exit code {result_code}")
            
    except KeyboardInterrupt:
        print("\n\n⚠️ Interrupted by user")
        result_code = 130
        
    finally:
        # Clean up the server
        if server_process:
            print(f"\n🛑 Stopping server (PID: {server_process.pid})...")
            
            try:
                # Try graceful termination first
                if sys.platform == "win32":
                    subprocess.run(
                        f"taskkill /F /T /PID {server_process.pid}",
                        shell=True,
                        capture_output=True
                    )
                else:
                    os.killpg(os.getpgid(server_process.pid), signal.SIGTERM)
                    server_process.wait(timeout=5)
            except Exception:
                # Force kill if needed
                try:
                    server_process.kill()
                    server_process.wait(timeout=2)
                except:
                    pass
            
            print("✅ Server stopped")
    
    sys.exit(result_code)


if __name__ == "__main__":
    main()
