#!/bin/bash

# HostelMate Setup Script
echo "=========================================="
echo "🚀 HostelMate Project Setup"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed! Please install Node.js (v16 or higher)"
    exit 1
fi

echo "✅ Node.js is installed"
node --version

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Create backend .env if not exists
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cat > .env << EOF
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ Backend .env created"
fi

# Generate Prisma client and run migrations
echo ""
echo "🔧 Setting up database..."
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
echo "✅ Database setup complete"

cd ..

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"

echo ""
echo "=========================================="
echo "🎉 Setup Complete!"
echo "=========================================="
echo ""
echo "To start the project:"
echo "1. Terminal 1 - Backend: cd backend && npm run dev"
echo "2. Terminal 2 - Frontend: cd frontend && npm start"
echo ""
echo "Test Credentials:"
echo "  Admin: admin@hostel.com / admin123"
echo "  Warden: warden@hostel.com / warden123"
echo "  Student: student1@hostel.com / student123"
