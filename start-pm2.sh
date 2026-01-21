#!/bin/bash

# Kill existing PM2 processes
pm2 kill

# Start backend
pm2 start server/index.js --name "portfolio-backend" --env production

# Start frontend (after build)
npm run build
pm2 start npm --name "portfolio-frontend" -- start --env production

# Show status
pm2 status
pm2 save
