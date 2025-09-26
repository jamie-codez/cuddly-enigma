variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The GCP zone"
  type        = string
  default     = "us-central1-a"
}

variable "machine_type" {
  description = "The machine type for the VM instance"
  type        = string
  default     = "e2-medium"
}

variable "boot_disk_size" {
  description = "The size of the boot disk in GB"
  type        = number
  default     = 20
}

variable "boot_disk_type" {
  description = "The type of the boot disk"
  type        = string
  default     = "pd-standard"
}

variable "ssh_user" {
  description = "SSH username"
  type        = string
  default     = "devops"
}

variable "ssh_public_key_path" {
  description = "Path to SSH public key"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "devops-assessment"
}

variable "network_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR block for the subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "allowed_source_ranges" {
  description = "Source IP ranges allowed to access the instance"
  type = list(string)
  default = ["0.0.0.0/0"]
}

variable "enable_os_login" {
  description = "Enable OS Login for the instance"
  type        = bool
  default     = false
}

variable "labels" {
  description = "Labels to apply to resources"
  type = map(string)
  default = {}
}