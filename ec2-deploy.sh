#!/bin/bash

# AWS EC2 Deployment Script for Portfolio Application
# Make sure to run this script on your EC2 instance

set -e

echo "🚀 Starting AWS EC2 deployment for Portfolio Application..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker and Docker Compose
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
fi

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install Node.js (for local development if needed)
echo "📚 Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 for process management
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/portfolio
sudo chown $USER:$USER /var/www/portfolio

# Navigate to application directory
cd /var/www/portfolio

# Clone or update the repository (replace with your actual repo URL)
echo "📥 Cloning application repository..."
if [ -d ".git" ]; then
    git pull origin main
else
    git clone <YOUR_GIT_REPO_URL> .
fi

# Copy environment file
echo "🔧 Setting up environment variables..."
if [ ! -f ".env" ]; then
    cp env.production.example .env
    echo "⚠️  Please update the .env file with your actual environment variables!"
    echo "   Edit: nano /var/www/portfolio/.env"
fi

# Build and start containers
echo "🏗️ Building and starting Docker containers..."
docker-compose down
docker-compose build
docker-compose up -d

# Setup firewall
echo "🔥 Setting up firewall..."
sudo ufw allow ssh
sudo ufw allow 3000
sudo ufw allow 5000
sudo ufw --force enable

# Setup SSL with Let's Encrypt (optional)
echo "🔐 Setting up SSL certificate..."
sudo apt install -y certbot python3-certbot-nginx

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your application should be available at:"
echo "   Frontend: http://$(curl -s ifconfig.me):3000"
echo "   Backend:  http://$(curl -s ifconfig.me):5000"
echo ""
echo "📝 Next steps:"
echo "   1. Update your .env file with actual values"
echo "   2. Configure your domain name to point to this EC2 instance"
echo "   3. Setup SSL certificate for production domain"
echo "   4. Configure security groups in AWS console"
echo ""
echo "🔍 Check application status:"
echo "   docker-compose logs -f"
echo "   docker-compose ps"
