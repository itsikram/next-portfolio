# AWS EC2 Deployment Guide

This guide will help you deploy your Next.js Portfolio application on AWS EC2.

## Prerequisites

- AWS account with EC2 access
- Domain name (optional, for production)
- Git repository with your code

## Quick Deployment

### 1. Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose **Ubuntu Server 22.04 LTS**
3. Select **t3.medium** or larger (recommended for production)
4. Configure security groups to allow:
   - SSH (Port 22)
   - HTTP (Port 80)
   - HTTPS (Port 443)
   - Custom: 3000 (Frontend)
   - Custom: 5000 (Backend)
5. Launch and connect via SSH

### 2. Deploy Application

Once connected to your EC2 instance:

```bash
# Clone your repository
git clone <YOUR_GIT_REPO_URL>
cd portfolio

# Run the deployment script
chmod +x ec2-deploy.sh
./ec2-deploy.sh
```

### 3. Configure Environment Variables

Edit the `.env` file with your actual values:

```bash
nano .env
```

Important variables to update:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Generate a secure random string
- `CLOUDINARY_*` - Your Cloudinary credentials
- `EMAIL_*` - Your email service credentials
- `ALLOWED_ORIGINS` - Your domain/IP addresses

### 4. Start Services

#### Option A: Docker (Recommended)
```bash
docker-compose up -d
```

#### Option B: PM2
```bash
npm run pm2:start
```

## Manual Deployment Steps

If you prefer manual deployment:

### 1. Install Dependencies

```bash
sudo apt update
sudo apt install -y git nodejs npm docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### 2. Setup Application

```bash
# Clone repository
git clone <YOUR_REPO_URL>
cd portfolio

# Install dependencies
npm install

# Build application
npm run build

# Setup environment
cp env.production.example .env
# Edit .env with your values
```

### 3. Database Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create a free MongoDB Atlas account
2. Create a cluster
3. Get connection string and update `MONGODB_URI`

#### Option B: Local MongoDB
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Start Services

```bash
# Using PM2
sudo npm install -g pm2
npm run pm2:start

# Or using Docker
docker-compose up -d
```

## Domain Setup (Optional)

### 1. Point Domain to EC2

In your domain provider's DNS settings:
- Create an A record pointing to your EC2 public IP
- Optionally create CNAME for www subdomain

### 2. Setup SSL Certificate

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 3. Configure Nginx

Create `/etc/nginx/sites-available/yourdomain.com`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Monitoring and Maintenance

### Check Application Status

```bash
# Docker containers
docker-compose ps
docker-compose logs -f

# PM2 processes
pm2 status
pm2 logs

# System resources
htop
df -h
free -h
```

### Backup Database

```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=/backup/$(date +%Y%m%d)

# Compress backup
tar -czf /backup/portfolio-$(date +%Y%m%d).tar.gz /backup/$(date +%Y%m%d)
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Or with PM2
pm2 restart all
```

## Security Recommendations

1. **Update `.env` values** - Use strong, unique passwords and secrets
2. **Configure firewall** - Only allow necessary ports
3. **Use HTTPS** - Setup SSL certificates
4. **Regular updates** - Keep system and dependencies updated
5. **Monitor logs** - Check for suspicious activity
6. **Backup regularly** - Automated database backups

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
sudo netstat -tulpn | grep :3000
sudo kill -9 <PID>
```

**Permission issues:**
```bash
sudo chown -R $USER:$USER /var/www/portfolio
```

**Docker issues:**
```bash
docker system prune -a
docker-compose down --volumes
docker-compose up -d --build
```

**Memory issues:**
```bash
# Create swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Support

For deployment issues:
1. Check logs: `docker-compose logs -f` or `pm2 logs`
2. Verify environment variables
3. Check AWS security group settings
4. Ensure all ports are properly configured

Your application should now be running on AWS EC2! 🚀
