#!/bin/bash

# Kill existing PM2 processes
pm2 kill

# Build the Next.js application first
echo "Building Next.js application..."
npm run build

# Start backend
echo "Starting backend..."
NODE_ENV=production pm2 start server/index.js --name "portfolio-backend"

# Start frontend (after build)
echo "Starting frontend..."
pm2 start "npm" --name "portfolio-frontend" -- start

# Show status
pm2 status
pm2 save
pm2 logs
