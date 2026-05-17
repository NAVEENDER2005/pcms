#!/usr/bin/env python3
"""
Consultant Bench Management System Runner - Error-Free Version
"""
import asyncio
import subprocess
import sys
import os
from pathlib import Path
import time

def check_environment():
    """Check if we're in the right directory and environment is set up"""
    current_dir = Path.cwd()
    
    # Check if we're in project root
    required_files = ['.env', 'requirements.txt']
    required_dirs = ['agents', 'mcp_servers', 'database']
    
    missing_files = [f for f in required_files if not (current_dir / f).exists()]
    missing_dirs = [d for d in required_dirs if not (current_dir / d).exists()]
    
    if missing_files or missing_dirs:
        print(f"❌ Missing files: {missing_files}")
        print(f"❌ Missing directories: {missing_dirs}")
        print(f"💡 Make sure you're running from project root: {current_dir}")
        return False
    
    # Check virtual environment
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Warning: Virtual environment not detected")
        print("💡 Run: .venv\\Scripts\\activate")
    
    return True

def create_missing_files():
    """Create missing __init__.py files"""
    init_files = [
        "agents/__init__.py",
        "agents/consultant_profiling_agent/__init__.py",
        "agents/bench_tracking_agent/__init__.py", 
        "agents/project_matching_agent/__init__.py",
        "database/__init__.py",
        "database/models/__init__.py",
        "utils/__init__.py"
    ]
    
    for init_file in init_files:
        file_path = Path(init_file)
        if not file_path.exists():
            file_path.parent.mkdir(parents=True, exist_ok=True)
            file_path.write_text("# Auto-generated __init__.py\n")
            print(f"✅ Created {init_file}")

def install_dependencies():
    """Install required Python packages with error handling"""
    print("📦 Installing dependencies...")
    
    # First, upgrade pip
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
        print("✅ pip upgraded successfully!")
    except subprocess.CalledProcessError as e:
        print(f"⚠️  pip upgrade failed: {e}")
    
    # Install packages one by one for better error tracking
    essential_packages = [
        "python-dotenv",
        "numpy>=1.24.0",
        "sqlalchemy>=2.0.30",
        "pg8000>=1.31.0",
        "fastapi==0.104.1",
        "uvicorn==0.24.0",
        "pydantic>=2.5.0",
        "pytest>=7.4.0",
        "pytest-asyncio>=0.23.0"
    ]
    
    for package in essential_packages:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install {package}: {e}")
            return False
    
    # Try installing the full requirements
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Some packages failed, but essentials are installed: {e}")
        return True

def setup_database():
    """Initialize database with error handling"""
    print("🗄️  Setting up database...")
    try:
        # Add current directory to Python path
        sys.path.insert(0, str(Path.cwd()))
        
        from database.connection import init_db, test_connection
        
        # Test connection first
        if not test_connection():
            print("❌ Database connection failed.")
            print("💡 Make sure PostgreSQL is running and .env is configured")
            return False
        
        # Initialize database
        init_db()
        print("✅ Database setup complete!")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("💡 Make sure dependencies are installed: python run_system.py install")
        return False
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

def setup_environment():
    """Setup Python path and environment"""
    # Add current directory to Python path
    current_dir = str(Path.cwd())
    if current_dir not in sys.path:
        sys.path.insert(0, current_dir)
    
    # Set PYTHONPATH environment variable
    os.environ['PYTHONPATH'] = current_dir

async def run_single_server(server_name, port):
    """Run a single MCP server with proper error handling"""
    server_file = f"mcp_servers/{server_name}_server.py"
    
    if not Path(server_file).exists():
        print(f"❌ Server file not found: {server_file}")
        return None
    
    print(f"🚀 Starting {server_name} on port {port}...")
    
    # Setup environment for subprocess
    env = os.environ.copy()
    env['PYTHONPATH'] = str(Path.cwd())
    
    try:
        process = subprocess.Popen(
            [sys.executable, server_file],
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE, 
            text=True,
            env=env  # Pass environment variables
        )
        
        # Give server time to start
        time.sleep(3)
        
        # Check if process is still running
        if process.poll() is None:
            print(f"✅ {server_name} started successfully on port {port}")
            return process
        else:
            stdout, stderr = process.communicate()
            print(f"❌ {server_name} failed to start:")
            print(f"stdout: {stdout}")
            print(f"stderr: {stderr}")
            return None
            
    except Exception as e:
        print(f"❌ Failed to start {server_name}: {e}")
        return None

async def run_mcp_servers():
    """Run all MCP servers with proper setup"""
    print("🔧 Setting up environment...")
    setup_environment()
    
    servers = [
        ("consultant_profiling", 8001),
        ("bench_tracking", 8002),
        ("project_matching", 8003)
    ]
    
    print("🚀 Starting Consultant Bench Management System...")
    print("=" * 50)
    
    processes = []
    
    for server_name, port in servers:
        process = await run_single_server(server_name, port)
        if process:
            processes.append((server_name, process, port))
        else:
            print(f"❌ Failed to start {server_name}")
            # Don't abort - continue with other servers
    
    if processes:
        print("\n🎉 Started servers successfully!")
        print("=" * 50)
        print("📡 Server Status:")
        for name, _, port in processes:
            print(f"   • {name.replace('_', ' ').title()}: http://localhost:{port}")
        
        print("\n💡 Tips:")
        print("   • Test with: curl http://localhost:8001/health")
        print("   • Check logs in this terminal")
        print("   • Press Ctrl+C to stop all servers")
        
        try:
            # Wait and monitor processes
            while True:
                # Check if any process has died
                for name, process, port in processes:
                    if process.poll() is not None:
                        print(f"❌ {name} server stopped unexpectedly")
                        
                await asyncio.sleep(2)
                
        except KeyboardInterrupt:
            print("\n🛑 Shutting down servers...")
            for name, process, port in processes:
                print(f"   Stopping {name}...")
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
            print("✅ All servers stopped!")
    else:
        print("❌ No servers started successfully")

def run_tests():
    """Run tests with proper setup"""
    try:
        setup_environment()
        subprocess.check_call([sys.executable, "-m", "pytest", "tests/", "-v"])
        print("✅ All tests passed!")
        return True
    except subprocess.CalledProcessError:
        print("❌ Some tests failed")
        return False
    except FileNotFoundError:
        print("⚠️  pytest not found, installing...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pytest", "pytest-asyncio"])
        return run_tests()

def show_help():
    """Show help information"""
    print("""
🏢 Consultant Bench Management System - Fixed Version

Usage: python run_system.py [command]

Commands:
  install    - Install dependencies and create missing files
  setup      - Setup database (run install first)
  test       - Run tests
  run        - Start all MCP servers
  check      - Check system configuration
  help       - Show this help

🚀 Quick Start (Error-Free):
  1. python run_system.py install
  2. python run_system.py setup  
  3. python run_system.py run
""")

def main():
    """Main entry point with comprehensive error handling"""
    
    if not check_environment():
        print("💡 Run from project root directory")
        return
    
    if len(sys.argv) < 2:
        show_help()
        return
    
    command = sys.argv[1].lower()
    
    if command == "install":
        create_missing_files()
        if install_dependencies():
            print("\n✅ Installation complete!")
            print("💡 Next: python run_system.py setup")
        
    elif command == "setup":
        create_missing_files()
        setup_environment()
        if setup_database():
            print("\n✅ Setup complete!")
            print("💡 Next: python run_system.py run")
        
    elif command == "test":
        create_missing_files()
        run_tests()
        
    elif command == "run":
        create_missing_files()
        setup_environment()
        
        # Quick database check
        try:
            sys.path.insert(0, str(Path.cwd()))
            from database.connection import test_connection
            if not test_connection():
                print("❌ Database not ready. Run: python run_system.py setup")
                return
        except Exception as e:
            print(f"⚠️  Database check failed: {e}")
        
        asyncio.run(run_mcp_servers())
        
    elif command == "check":
        print("🔍 System Configuration Check:")
        print(f"✅ Project directory: {Path.cwd()}")
        print(f"✅ Python version: {sys.version}")
        
        # Check files
        for file in ['.env', 'requirements.txt']:
            if Path(file).exists():
                print(f"✅ {file} found")
            else:
                print(f"❌ {file} missing")
        
        # Check modules
        try:
            setup_environment()
            import agents, database
            print("✅ Modules can be imported")
        except ImportError as e:
            print(f"❌ Import error: {e}")
        
    elif command == "help":
        show_help()
        
    else:
        print(f"❌ Unknown command: {command}")
        show_help()

if __name__ == "__main__":
    main()
