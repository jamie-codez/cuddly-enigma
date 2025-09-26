location            = "East US"
resource_group_name = "rg-devops-assessment-dev"
vm_size             = "Standard_B1s"
admin_username      = "jamie"
environment         = "dev"

os_disk_size_gb = 30

allowed_source_address_prefixes = ["*"]

tags = {
  Environment = "dev"
  Owner       = "DevOps Team"
  Project     = "DevOps Assessment"
  Terraform   = "true"
}