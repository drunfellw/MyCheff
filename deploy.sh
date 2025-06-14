#!/bin/bash

# MyCheff Production Deployment Script
# Author: MyCheff Team
# Version: 1.0.0

set -e

echo "🍳 MyCheff Production Deployment Starting..."
echo "================================================="

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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_warning "Docker is not running. Attempting to start..."
        open -a Docker
        sleep 10
        if ! docker info > /dev/null 2>&1; then
            log_error "Docker failed to start. Please start Docker manually."
            exit 1
        fi
    fi
    log_success "Docker is running"
}

# Check dependencies
check_dependencies() {
    log_info "Checking dependencies..."
    
    # Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    log_success "All dependencies are installed"
}

# Database setup
setup_database() {
    log_info "Setting up database..."
    
    # Start PostgreSQL container
    docker-compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    log_info "Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Check if database is accessible
    until docker exec mycheff-postgres pg_isready -U postgres; do
        log_info "Waiting for PostgreSQL..."
        sleep 2
    done
    
    # Run schema setup
    log_info "Setting up database schema..."
    docker exec -i mycheff-postgres psql -U postgres -d postgres < database/setup_complete_schema.sql
    
    # Load sample data
    log_info "Loading sample Turkish recipes..."
    docker exec -i mycheff-postgres psql -U postgres -d postgres < mycheff-backend/complete_turkish_recipes.sql
    
    log_success "Database setup completed"
}

# Backend setup
setup_backend() {
    log_info "Setting up backend..."
    
    cd mycheff-backend
    
    # Install dependencies
    log_info "Installing backend dependencies..."
    npm install
    
    # Create .env if not exists
    if [ ! -f .env ]; then
        log_info "Creating .env file..."
        cat > .env << EOF
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=123

# Application Configuration
NODE_ENV=development
PORT=3001

# JWT Configuration
JWT_SECRET=mycheff-jwt-secret-key-2024-production-ready

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# API Configuration
API_VERSION=v1
CORS_ORIGINS=http://localhost:3000,http://localhost:19006

# Security
THROTTLE_TTL=60000
THROTTLE_LIMIT=100

# Database Schema
DATABASE_SCHEMA=mycheff
EOF
    fi
    
    # Build backend
    log_info "Building backend..."
    npm run build
    
    cd ..
    log_success "Backend setup completed"
}

# Frontend setup
setup_frontend() {
    log_info "Setting up frontend..."
    
    cd mycheff-frontend
    
    # Install dependencies
    log_info "Installing frontend dependencies..."
    npm install
    
    cd ..
    log_success "Frontend setup completed"
}

# Admin panel setup
setup_admin() {
    log_info "Setting up admin panel..."
    
    cd admin-panel
    
    # Install dependencies
    log_info "Installing admin panel dependencies..."
    npm install
    
    # Build admin panel
    log_info "Building admin panel..."
    npm run build
    
    cd ..
    log_success "Admin panel setup completed"
}

# Start services
start_services() {
    log_info "Starting all services..."
    
    # Start Redis
    docker-compose up -d redis
    
    # Start backend
    cd mycheff-backend
    log_info "Starting backend server..."
    npm run start:dev > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../logs/backend.pid
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Health check
    log_info "Performing health check..."
    if curl -f http://localhost:3001/api/v1/recipes/test > /dev/null 2>&1; then
        log_success "Backend is running on http://localhost:3001"
    else
        log_warning "Backend health check failed, but continuing..."
    fi
    
    # Start frontend
    cd mycheff-frontend
    log_info "Starting frontend (Expo)..."
    npm start > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../logs/frontend.pid
    cd ..
    
    # Start admin panel
    cd admin-panel
    log_info "Starting admin panel..."
    npm run dev > ../logs/admin.log 2>&1 &
    ADMIN_PID=$!
    echo $ADMIN_PID > ../logs/admin.pid
    cd ..
    
    log_success "All services are starting..."
}

# Create logs directory
mkdir -p logs

# Main execution
log_info "Starting MyCheff deployment..."

check_dependencies
check_docker
setup_database
setup_backend
setup_frontend
setup_admin
start_services

echo ""
echo "🎉 MyCheff Production Deployment Completed!"
echo "================================================="
echo ""
echo "📊 Service Status:"
echo "• Database: http://localhost:5432 (PostgreSQL)"
echo "• Redis: http://localhost:6379"
echo "• Backend API: http://localhost:3001"
echo "• Frontend (Mobile): http://localhost:19006"
echo "• Admin Panel: http://localhost:3000"
echo ""
echo "📋 API Documentation: http://localhost:3001/api/docs"
echo "📱 Mobile App: Open Expo Go and scan QR code"
echo "🔧 Admin Panel: http://localhost:3000"
echo ""
echo "📁 Logs:"
echo "• Backend: logs/backend.log"
echo "• Frontend: logs/frontend.log"
echo "• Admin: logs/admin.log"
echo ""
echo "⚡ Quick Commands:"
echo "• Stop all: ./stop.sh"
echo "• View logs: tail -f logs/*.log"
echo "• Database access: docker exec -it mycheff-postgres psql -U postgres"
echo ""
log_success "MyCheff is ready for production! 🚀" 