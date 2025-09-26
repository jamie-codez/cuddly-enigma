Of course, Jamie. A well-documented project is a professional project. This README is designed to be a comprehensive
guide, enabling anyone from a fellow engineer to a technical assessor to understand, set up, and replicate the entire
system from scratch.

Here is the detailed README file.

---

# Comprehensive DevOps & SRE Assessment Project

This repository contains a complete, end-to-end implementation of a modern web application stack, designed to showcase
best practices in DevOps, Cloud Engineering, and Site Reliability Engineering (SRE). The project covers the full
software development lifecycle: from local containerized development to automated multi-cloud deployment, configuration,
and production monitoring.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core Features](#core-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Step-by-Step Replication Guide](#step-by-step-replication-guide)
    - [Step 1: Local Development Setup](#step-1-local-development-setup)
    - [Step 2: Infrastructure Provisioning (IaC)](#step-2-infrastructure-provisioning-iac)
    - [Step 3: Server Configuration (Ansible)](#step-3-server-configuration-ansible)
    - [Step 4: CI/CD Pipeline Setup (GitHub Actions)](#step-4-ci-cd-pipeline-setup-github-actions)
    - [Step 5: Triggering Deployment](#step-5-triggering-deployment)
    - [Step 6: SRE & Monitoring Setup](#step-6-sre--monitoring-setup)
- [Detailed Task Breakdown](#detailed-task-breakdown)
- [API Endpoint Documentation](#api-endpoint-documentation)
- [Incident Response Protocol](#incident-response-protocol)
- [Troubleshooting](#troubleshooting)
- [Cleanup and Teardown](#cleanup-and-teardown)

## Architecture Overview

The diagram below illustrates the flow from a code commit to a multi-cloud deployment, including the monitoring feedback
loop.

```mermaid
graph TD
    subgraph "Development"
        A[Developer Commits Code] --> B{GitHub Repository};
    end

    subgraph "CI/CD Pipeline (GitHub Actions)"
        B -- Push Trigger --> C[Test & Lint];
        C --> D[Build Docker Image];
        D --> E[Push to GitHub Container Registry];
        E --> F[Security Scan (Trivy)];
    end

    subgraph "Deployment & Configuration"
        F -- Deploy Trigger --> G[Deploy to Cloud VM];
        G -- Uses SSH Key --> H((Cloud VM));
        I[Ansible Playbook] -- Configures --> H;
    end
    
    subgraph "Cloud Infrastructure (AWS/GCP/Azure)"
        J[Terraform IaC] -- Provisions --> H;
        H -- Runs --> K[App Container];
        H -- Runs --> L[Monitoring Stack];
    end

    subgraph "SRE & Monitoring"
        L -- Scrapes Metrics --> K;
        L -- Scrapes Metrics --> H;
        M[Prometheus] -- Feeds --> N[Grafana Dashboards];
        M -- Sends Alerts --> O[Alertmanager];
        O -- Notifies --> P[Slack Channel];
    end

    P -- Informs --> A;
```

## Core Features

- **Web Application**: A Node.js (Express) RESTful API with MongoDB integration for CRUD operations.
- **Containerization**: Fully containerized setup using Docker and Docker Compose for local development.
- **Multi-Cloud IaC**: Terraform configurations to provision infrastructure on AWS, GCP, and Azure.
- **CI/CD Automation**: A robust GitHub Actions pipeline that tests, builds, scans, and deploys the application.
- **Configuration Management**: Ansible playbook to install dependencies and configure the provisioned cloud servers.
- **SRE & Monitoring**: A complete monitoring stack (Prometheus, Grafana, Alertmanager) to track application/system
  health and send alerts.
- **Security**: Integrated security practices including `helmet`, non-root containers, and vulnerability scanning.

## Project Structure

```text
.
├── .github/workflows/      # GitHub Actions CI/CD pipeline
│   └── workflow.yaml
├── ansible/                # Ansible configuration management
│   ├── ansible.cfg
│   ├── files/
│   │   └── config.txt
│   ├── inventory.yaml
│   └── playbook.yaml
├── app/                    # Node.js application source code
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env                # Local environment variables (must be created)
│   ├── package.json
│   └── server.js
├── infrastructure/         # Terraform Infrastructure as Code
│   ├── aws/
│   ├── azure/
│   └── gcp/
├── monitoring/             # SRE monitoring stack configuration
│   ├── alert_rules.yaml
│   ├── alertmanager.yaml
│   ├── docker-compose.monitoring.yml
│   └── prometheus.yaml
├── docker-compose.yaml      # Docker Compose for local development
├── Dockerfile              # Multi-stage Dockerfile for the application
└── README.md               # This documentation file
```

## Prerequisites

Before you begin, ensure you have the following tools and accounts set up:

1. **Core Tools**:
    - [Git](https://git-scm.com/)
    - [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/)
    - [Terraform](https://www.terraform.io/downloads.html) (v1.0+)
    - [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)
2. **Accounts & Credentials**:
    - A [GitHub](https://github.com/) account.
    - A [Cloud Provider Account](https://aws.amazon.com/free/) (AWS, GCP, or Azure) with billing enabled.
    - CLI configured for your chosen cloud provider (e.g., `aws configure`).
3. **SSH Key**: A public/private SSH key pair, typically located at `~/.ssh/id_rsa` and `~/.ssh/id_rsa.pub`.

## Step-by-Step Replication Guide

Follow these steps in order to set up, deploy, and monitor the entire project.

### Step 1: Local Development Setup

This step allows you to run the entire application stack on your local machine.

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/devops-assessment.git
   cd devops-assessment
   ```

2. **Create Local Environment File**:
   Create a file named `.env` inside the `app/` directory and add the following content. This file is used by Docker
   Compose to configure the application container.
   ```env
   # app/.env
   MONGODB_URI=mongodb://user:pass@mongo:27017/devops_app?authSource=admin
   PORT=3000
   CORS_ORIGIN=*
   ```

3. **Run the Local Stack**:
   From the project root, start all services using Docker Compose.
   ```bash
   docker-compose up --build -d
   ```
    - The `--build` flag builds the application image from the Dockerfile.
    - The `-d` flag runs the containers in detached mode.

4. **Verify Local Setup**:
    - **API**: Open `http://localhost:3000` in your browser. You should see a JSON welcome message.
    - **Database UI**: Open `http://localhost:8081`. Log in with `admin`/`password` to access Mongo Express.
    - **API Health**: Check the health endpoint at `http://localhost:3000/health`.

### Step 2: Infrastructure Provisioning (IaC)

Choose your preferred cloud provider and provision the necessary VM and networking components using Terraform.

1. **Navigate to the IaC Directory**:
   ```bash
   # For AWS
   cd infrastructure/aws
   # For GCP
   # cd infrastructure/gcp
   # For Azure
   # cd infrastructure/azure
   ```

2. **Configure Variables**:
   Copy the example variables file and edit it with your specific details (e.g., project ID, key pair name).
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Now, edit terraform.tfvars with your values
   ```

3. **Initialize and Apply Terraform**:
   ```bash
   terraform init
   terraform plan
   terraform apply --auto-approve
   ```
   After the command completes, Terraform will output the public IP address of your newly created VM. **Copy this IP
   address for the next steps.**

### Step 3: Server Configuration (Ansible)

Now, configure the newly provisioned VM by installing PostgreSQL and Nginx using Ansible.

1. **Navigate to the Ansible Directory**:
   ```bash
   cd ../../ansible
   ```

2. **Update Inventory**:
   Edit the `ansible/inventory.yml` file. Replace `<YOUR_VM_IP>` with the public IP from the previous step. Also, ensure
   the `ansible_user` and `ansible_ssh_private_key_file` path are correct for your setup.

3. **Run a Connection Test**:
   ```bash
   ansible all -m ping
   ```
   You should see a green `SUCCESS` response.

4. **Execute the Playbook**:
   ```bash
   ansible-playbook playbook.yml
   ```
   This will connect to your VM and execute all the configuration tasks defined in the playbook.

### Step 4: CI/CD Pipeline Setup (GitHub Actions)

Configure GitHub repository secrets to allow the CI/CD pipeline to deploy automatically.

1. In your forked GitHub repository, go to `Settings` > `Secrets and variables` > `Actions`.
2. Click `New repository secret` for each of the following secrets.

   **Required Secrets for Deployment**:
    - `SSH_PRIVATE_KEY`: The content of your private SSH key file (`~/.ssh/id_rsa`). This is used to connect to the VM.
    - `AWS_INSTANCE_IP` (or `GCP_INSTANCE_IP`, `AZURE_INSTANCE_IP`): The public IP address of your VM.

   **Required Secrets for the Application (`APP_` prefix)**:
    - `APP_MONGODB_URI`: The connection string for your production database (this could be a managed service like Atlas,
      or you can run MongoDB on the same VM). Example: `mongodb://user:pass@localhost:27017/prod_db?authSource=admin`
    - `APP_CORS_ORIGIN`: The URL of your frontend application (e.g., `https://myapp.com`).

### Step 5: Triggering Deployment

The pipeline is configured to trigger automatically on a push to the `main` or `develop` branch.

1. **Commit and Push a Change**:
   Make a small change to the application code (e.g., update the message in `app/server.js`), then commit and push it.
   ```bash
   git add .
   git commit -m "feat: trigger initial deployment"
   git push origin main
   ```

2. **Monitor the Pipeline**:
   In your GitHub repository, go to the `Actions` tab to watch the pipeline run in real-time. It will proceed through
   the `test`, `build-and-push`, and `deploy` stages.

3. **Verify Deployment**:
   Once the pipeline succeeds, your application is live!
    - Access the API at `http://<YOUR_VM_IP>`.
    - Test the health endpoint: `curl http://<YOUR_VM_IP>/health`.

### Step 6: SRE & Monitoring Setup

Deploy the monitoring stack on your cloud VM to start collecting metrics.

1. **SSH into your VM**:
   ```bash
   ssh <ansible_user>@<YOUR_VM_IP> -i /path/to/your/ssh_private_key.pem
   ```

2. **Clone the Repository on the VM**:
   ```bash
   git clone https://github.com/<your-username>/devops-assessment.git
   cd devops-assessment/monitoring
   ```

3. **Configure Prometheus**:
   Edit the `prometheus.yml` file and replace all instances of `<YOUR_VM_IP>` with the server's public IP address.
   ```bash
   nano prometheus.yml
   ```

4. **Start the Monitoring Stack**:
   ```bash
   docker-compose -f docker-compose.monitoring.yml up -d
   ```

5. **Access Monitoring Tools**:
    - **Prometheus**: `http://<YOUR_VM_IP>:9090` (Check `Targets` to ensure all are `UP`)
    - **Grafana**: `http://<YOUR_VM_IP>:3001` (Login: `admin`/`admin`)
    - **Alertmanager**: `http://<YOUR_VM_IP>:9093`

## Detailed Task Breakdown

This project directly addresses all tasks from the technical assessment.

- **Task 1 (Version Control)**: The project is hosted on GitHub with a clear commit history and logical structure.
- **Task 2 (Containerization)**: A multi-stage `Dockerfile` optimizes the application image. `docker-compose.yml`
  provides a full-featured local development environment.
- **Task 3 (IaC)**: The `infrastructure/` directory contains Terraform code to provision all necessary resources on AWS,
  GCP, and Azure.
- **Task 4 (CI/CD)**: The `.github/workflows/ci-cd.yml` file defines a comprehensive pipeline that automates testing,
  building, security scanning (Trivy), and deploying to the VM.
- **Task 5 (SRE)**: The `monitoring/` directory contains the setup for Prometheus, Grafana, and Alertmanager, including
  alerting rules based on SLOs and an incident response guide.
- **Bonus Task (Ansible)**: The `ansible/` directory contains a playbook that idempotently configures the server, sets
  file permissions, and manages services.

## API Endpoint Documentation

| Method | Endpoint              | Description                      | `curl` Example                                                                                                              |
| :----- | :-------------------- | :------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/api/items`          | Create a new item.               | `curl -X POST -H "Content-Type: application/json" -d '{"name":"New Item"}' http://<IP>/api/items`                             |
| `GET`  | `/api/items`          | Retrieve all items.              | `curl http://<IP>/api/items`                                                                                                |
| `GET`  | `/api/items/{id}`     | Retrieve a single item by its ID. | `curl http://<IP>/api/items/6513a1b2c3d4e5f6a7b8c9d0`                                                                        |
| `PUT`  | `/api/items/{id}`     | Update an existing item.         | `curl -X PUT -H "Content-Type: application/json" -d '{"quantity":50}' http://<IP>/api/items/6513a1b2c3d4e5f6a7b8c9d0`          |
| `DELETE`| `/api/items/{id}`     | Delete an item.                  | `curl -X DELETE http://<IP>/api/items/6513a1b2c3d4e5f6a7b8c9d0`                                                               |
| `GET`  | `/health`             | Get application health status.   | `curl http://<IP>/health`                                                                                                   |
| `GET`  | `/metrics`            | Expose Prometheus metrics.       | `curl http://<IP>/metrics`                                                                                                  |

## Incident Response Protocol

A basic incident response protocol is defined in `docs/incident-response.md`. It outlines the steps for triaging alerts,
provides an example investigation playbook, and emphasizes the importance of a blameless postmortem culture.

## Troubleshooting

- **Permission Denied (SSH)**: Ensure your SSH key is added to your SSH agent (`ssh-add ~/.ssh/id_rsa`) and has the
  correct permissions (`chmod 600 ~/.ssh/id_rsa`).
- **Terraform Authentication Issues**: Make sure you have authenticated your cloud provider's CLI locally (e.g.,
  `aws configure` or `gcloud auth login`).
- **Docker Port Conflicts**: If you get an error that a port is already in use, check for other running processes on
  that port (`lsof -i :<port_number>`) or change the port mapping in the `docker-compose.yml` file.

## Cleanup and Teardown

To avoid incurring cloud costs, destroy all provisioned infrastructure when you are finished.

1. Navigate to the respective cloud provider directory in `infrastructure/`.
2. Run the destroy command:
   ```bash
   terraform destroy --auto-approve
   ```

This will safely and completely remove all resources created by Terraform.