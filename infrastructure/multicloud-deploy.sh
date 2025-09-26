#!/bin/bash

set -e

CLOUD_PROVIDER=${1:-"aws"}
ENVIRONMENT=${2:-"dev"}

echo "🚀 Deploying to $CLOUD_PROVIDER ($ENVIRONMENT environment)"

case $CLOUD_PROVIDER in
  "aws")
    echo "📦 Deploying AWS infrastructure..."
    cd infrastructure/aws
    terraform init
    terraform workspace select $ENVIRONMENT || terraform workspace new $ENVIRONMENT
    terraform plan -var-file="environments/$ENVIRONMENT.tfvars"
    terraform apply -var-file="environments/$ENVIRONMENT.tfvars" -auto-approve
    ;;

  "gcp")
    echo "📦 Deploying GCP infrastructure..."
    cd infrastructure/gcp

    # Authenticate with GCP (if not already done)
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
      echo "Please authenticate with GCP first:"
      echo "gcloud auth application-default login"
      exit 1
    fi

    terraform init
    terraform workspace select $ENVIRONMENT || terraform workspace new $ENVIRONMENT
    terraform plan -var-file="environments/$ENVIRONMENT.tfvars"
    terraform apply -var-file="environments/$ENVIRONMENT.tfvars" -auto-approve
    ;;

  "azure")
    echo "📦 Deploying Azure infrastructure..."
    cd infrastructure/azure

    # Login to Azure (if not already done)
    if ! az account show &>/dev/null; then
      echo "Please login to Azure first:"
      echo "az login"
      exit 1
    fi

    terraform init
    terraform workspace select $ENVIRONMENT || terraform workspace new $ENVIRONMENT
    terraform plan -var-file="environments/$ENVIRONMENT.tfvars"
    terraform apply -var-file="environments/$ENVIRONMENT.tfvars" -auto-approve
    ;;

  *)
    echo "❌ Unsupported cloud provider: $CLOUD_PROVIDER"
    echo "Supported providers: aws, gcp, azure"
    exit 1
    ;;
esac

echo "✅ Infrastructure deployment completed!"

# Get outputs
SERVER_IP=$(terraform output -raw external_ip 2>/dev/null || terraform output -raw public_ip)

echo "🌐 Server IP: $SERVER_IP"
echo "🔧 Next steps:"
echo "  1. Update Ansible inventory with IP: $SERVER_IP"
echo "  2. Run: cd ansible && ansible-playbook -i inventory.yml playbook.yml"
echo "  3. Configure CI/CD with server IP"