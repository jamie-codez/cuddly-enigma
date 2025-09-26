#!/bin/bash

# Log everything
exec > >(tee /var/log/startup-script.log) 2>&1

echo "Starting GCP VM startup script..."

# Update system
apt-get update -y
apt-get upgrade -y

# Install essential packages
apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    htop \
    tree \
    jq \
    vim \
    python3-pip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io

# Add user to docker group
SSH_USER=$(getent passwd 1000 | cut -d: -f1)
if [ -n "$SSH_USER" ]; then
    usermod -aG docker $SSH_USER
fi

# Install Docker Compose
DOCKER_COMPOSE_VERSION="2.21.0"
curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Install Google Cloud SDK (if not already present)
if ! command -v gcloud &> /dev/null; then
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
    apt-get update -y
    apt-get install -y google-cloud-sdk
fi

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Nginx
apt-get install -y nginx

# Install Cloud Logging agent
curl -sSO https://dl.google.com/cloudagents/add-logging-agent-repo.sh
bash add-logging-agent-repo.sh --also-install

# Install Cloud Monitoring agent
curl -sSO https://dl.google.com/cloudagents/add-monitoring-agent-repo.sh
bash add-monitoring-agent-repo.sh --also-install

# Create application directory
mkdir -p /opt/devops-app
if [ -n "$SSH_USER" ]; then
    chown -R $SSH_USER:$SSH_USER /opt/devops-app
fi

# Start and enable services
systemctl enable docker
systemctl start docker
systemctl enable nginx
systemctl start nginx

# Create a simple health check
cat << 'EOF' > /var/www/html/health.html
<!DOCTYPE html>
<html>
<head>
    <title>GCP Server Health Check</title>
</head>
<body>
    <h1>GCP Server is Running</h1>
    <p>Timestamp: <script>document.write(new Date().toISOString());</script></p>
    <p>Instance Name: <script>
        fetch('/computeMetadata/v1/instance/name', {
            headers: {'Metadata-Flavor': 'Google'}
        }).then(r => r.text()).then(name => document.write(name));
    </script></p>
</body>
</html>
EOF

echo "GCP VM startup script completed successfully!"