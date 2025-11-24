#!/bin/bash

echo "🚀 Setting up Efootball Showdown 2025..."

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p database
mkdir -p public/uploads

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Initialize database
echo "🗄️  Initializing database..."
npm run db:init

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Copy .env.example to .env.local and configure your environment variables"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000"
echo ""
echo "🔐 Default admin credentials:"
echo "   Email: admin@efootballshowdown.com"
echo "   Password: Admin123!"
echo "   ⚠️  Please change the password immediately!"

