# LokalWay Free VM Deployment Guide

This setup keeps LokalWay free to run now and easy to upgrade later.

## 1. What you are deploying
- `client`: static React app served by Nginx
- `server`: Express API
- external services:
  - MongoDB Atlas
  - Cloudinary
  - Stripe
  - Firebase
  - your email account/app password for OTP mail

## 2. Before you deploy
- Rotate the secrets currently present in your local environment before public deployment.
- Create:
  - `server/.env` from `server/.env.example`
  - `client/.env` from `client/.env.example`
  - `compose.env` from `compose.env.example`

For same-domain deployment through the bundled Nginx proxy:
- keep `VITE_API_BASE_URL=` blank in `client/.env`
- set `CORS_ORIGIN` in `server/.env` to your final public origin, for example `https://app.example.com`

## 3. Free VM setup
Recommended free path:
- Oracle Cloud Always Free Ubuntu VM

Install on the VM:
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
newgrp docker
docker --version
docker compose version
```

## 4. Initial app setup on the VM
```bash
sudo mkdir -p /opt/lokalway
sudo chown -R "$USER":"$USER" /opt/lokalway
cd /opt/lokalway
git clone <YOUR_REPOSITORY_URL> app
cd app
cp server/.env.example server/.env
cp client/.env.example client/.env
cp compose.env.example compose.env
```

Edit these files and add your real values:
- `server/.env`
- `client/.env`
- `compose.env`

## 5. First local production-style run on the VM
```bash
cd /opt/lokalway/app
docker compose --env-file compose.env -f docker-compose.prod.yml up -d --build
docker compose --env-file compose.env -f docker-compose.prod.yml ps
curl http://127.0.0.1/healthz
curl http://127.0.0.1/
```

## 6. GitHub Actions secrets for auto-deploy
Add these repository secrets:
- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PORT`
- `DEPLOY_APP_DIR`
- `DEPLOY_COMPOSE_ENV_FILE`

Recommended values:
- `DEPLOY_APP_DIR=/opt/lokalway/app`
- `DEPLOY_COMPOSE_ENV_FILE=/opt/lokalway/app/compose.env`

## 7. How auto-deploy works
On push to `main`, GitHub Actions:
1. builds the client
2. checks backend syntax
3. validates both Docker images build
4. connects to the VM over SSH
5. runs `ops/deploy/vm-update.sh`

That script:
1. pulls latest code
2. rebuilds containers
3. restarts the stack
4. checks `/healthz`
5. checks the homepage

## 8. How you test everything step by step

### A. Container tests
```bash
docker compose --env-file compose.env -f docker-compose.prod.yml build
docker compose --env-file compose.env -f docker-compose.prod.yml up -d
docker compose --env-file compose.env -f docker-compose.prod.yml logs --tail=100
```

### B. Health and routing tests
```bash
curl http://127.0.0.1/healthz
curl http://127.0.0.1/
curl http://127.0.0.1/api/v1/users/check-user -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
```

### C. Product smoke tests in browser
Test:
- homepage loads
- sign up / login
- Google sign in
- guide onboarding
- trip creation
- trip booking
- guide booking
- chat load/send

## 9. Rollback
If a deploy breaks:
```bash
cd /opt/lokalway/app
git log --oneline -5
git checkout <OLDER_COMMIT_OR_TAG>
docker compose --env-file compose.env -f docker-compose.prod.yml up -d --build
```

## 10. Upgrade later without major changes
Later you can switch independently:
- VM size
- database tier
- CI runner type
- reverse proxy/TLS setup
- Compose to Kubernetes

The app containers and env contract stay the same.
