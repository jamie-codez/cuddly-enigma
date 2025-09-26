# Azure Configuration
location = "East US"
resource_group_name = "rg-devops-assessment"

# VM Configuration
vm_size         = "Standard_B1s"
admin_username  = "jamie"
os_disk_size_gb = 30
os_disk_type = "Standard_LRS"

# Project Configuration
project_name = "devops-assessment"
environment = "dev"

# Network Configuration
vnet_address_space = ["10.0.0.0/16"]
subnet_address_prefixes = ["10.0.1.0/24"]
allowed_source_address_prefixes = ["*"] # Restrict this in production

# SSH Configuration
ssh_public_key_path = "~/.ssh/id_rsa.pub"

# Performance Configuration
enable_accelerated_networking = false

# Tags
tags = {
  Owner       = "DevOps Team"
  Department  = "Engineering"
  Environment = "dev"
  Project     = "devops-assessment"
  Terraform   = "true"
  CostCenter  = "Engineering"
}