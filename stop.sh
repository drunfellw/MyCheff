#!/bin/bash

# MyCheff Stop Services Script
# Author: MyCheff Team
# Version: 1.0.0

echo "🛑 Stopping MyCheff Services..."
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Stop Node.js processes
stop_node_processes() {
    log_info "Stopping Node.js processes..."
    
    # Stop processes using PID files
    if [ -f logs/backend.pid ]; then
        BACKEND_PID=$(cat logs/backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            log_success "Backend stopped (PID: $BACKEND_PID)"
        fi
        rm -f logs/backend.pid
    fi
    
    if [ -f logs/frontend.pid ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            log_success "Frontend stopped (PID: $FRONTEND_PID)"
        fi
        rm -f logs/frontend.pid
    fi
    
    if [ -f logs/admin.pid ]; then
        ADMIN_PID=$(cat logs/admin.pid)
        if kill -0 $ADMIN_PID 2>/dev/null; then
            kill $ADMIN_PID
            log_success "Admin panel stopped (PID: $ADMIN_PID)"
        fi
        rm -f logs/admin.pid
    fi
    
    # Kill any remaining Node processes related to our project
    pkill -f "nest start"
    pkill -f "expo start"
    pkill -f "next dev"
}

# Stop Docker containers
stop_docker() {
    log_info "Stopping Docker containers..."
    
    # Stop specific containers
    docker-compose down
    
    log_success "Docker containers stopped"
}

# Clean up
cleanup() {
    log_info "Cleaning up..."
    
    # Remove PID files
    rm -f logs/*.pid
    
    log_success "Cleanup completed"
}

# Main execution
stop_node_processes
stop_docker
cleanup

echo ""
echo "✅ All MyCheff services have been stopped!"
echo ""
echo "To start again, run: ./deploy.sh"
echo "" 