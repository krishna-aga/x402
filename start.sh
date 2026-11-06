#!/bin/bash

# Exit script on Ctrl+C (SIGINT) or SIGTERM
cleanup() {
    echo ""
    echo "🛑 Shutting down x402 Marketplace services..."
    kill 0
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "🚀 Starting x402 API Marketplace..."

# Check if .env exists, fallback to .env.example if missing
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "⚠️ .env file not found. Creating from .env.example..."
        cp .env.example .env
    fi
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing root and frontend dependencies..."
    npm install
fi

# Start Backend
echo "📦 Starting Backend Server on http://localhost:5000..."
npx nodemon index.js &
BACKEND_PID=$!

# Start Frontend
echo "💻 Starting Frontend App..."
npm run dev --prefix frontend &
FRONTEND_PID=$!

echo ""
echo "=================================================="
echo "🌐 Frontend Web App:  http://localhost:5173"
echo "⚙️ Backend API Server: http://localhost:5000"
echo "=================================================="
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
