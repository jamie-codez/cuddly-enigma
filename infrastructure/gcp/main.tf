terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Data Sources
data "google_compute_image" "ubuntu" {
  family  = "ubuntu-2204-lts"
  project = "ubuntu-os-cloud"
}

# VPC Network
resource "google_compute_network" "main" {
  name                    = "${var.project_name}-${var.environment}-vpc"
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"

  description = "VPC network for ${var.project_name} ${var.environment} environment"
}

# Subnet
resource "google_compute_subnetwork" "public" {
  name          = "${var.project_name}-${var.environment}-public-subnet"
  ip_cidr_range = var.subnet_cidr
  region        = var.region
  network       = google_compute_network.main.id

  description = "Public subnet for ${var.project_name} ${var.environment}"

  secondary_ip_range {
    range_name    = "services-range"
    ip_cidr_range = "10.1.0.0/24"
  }

  secondary_ip_range {
    range_name    = "pods-range"
    ip_cidr_range = "10.2.0.0/16"
  }

  private_ip_google_access = true
}

# Firewall Rules
resource "google_compute_firewall" "allow_http_https" {
  name    = "${var.project_name}-${var.environment}-allow-http-https"
  network = google_compute_network.main.name

  description = "Allow HTTP and HTTPS traffic"

  allow {
    protocol = "tcp"
    ports = ["80", "443"]
  }

  source_ranges = var.allowed_source_ranges
  target_tags = ["web-server"]
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "${var.project_name}-${var.environment}-allow-ssh"
  network = google_compute_network.main.name

  description = "Allow SSH access"

  allow {
    protocol = "tcp"
    ports = ["22"]
  }

  source_ranges = var.allowed_source_ranges
  target_tags = ["web-server"]
}

resource "google_compute_firewall" "allow_application" {
  name    = "${var.project_name}-${var.environment}-allow-application"
  network = google_compute_network.main.name

  description = "Allow application traffic"

  allow {
    protocol = "tcp"
    ports = ["3000"]
  }

  source_ranges = var.allowed_source_ranges
  target_tags = ["web-server"]
}

resource "google_compute_firewall" "allow_monitoring" {
  name    = "${var.project_name}-${var.environment}-allow-monitoring"
  network = google_compute_network.main.name

  description = "Allow monitoring traffic (Prometheus, Grafana, Node Exporter)"

  allow {
    protocol = "tcp"
    ports = ["9090", "3001", "9100"]
  }

  source_ranges = var.allowed_source_ranges
  target_tags = ["web-server"]
}

# Static IP Address
resource "google_compute_address" "web_static_ip" {
  name   = "${var.project_name}-${var.environment}-static-ip"
  region = var.region

  description = "Static IP for ${var.project_name} web server"
}

# Service Account for VM
resource "google_service_account" "vm_service_account" {
  account_id   = "${var.project_name}-${var.environment}-vm"
  display_name = "${var.project_name} ${var.environment} VM Service Account"
  description  = "Service account for ${var.project_name} VM instance"
}

# IAM bindings for service account
resource "google_project_iam_member" "vm_logging" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.vm_service_account.email}"
}

resource "google_project_iam_member" "vm_monitoring" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.vm_service_account.email}"
}

resource "google_project_iam_member" "vm_monitoring_viewer" {
  project = var.project_id
  role    = "roles/monitoring.viewer"
  member  = "serviceAccount:${google_service_account.vm_service_account.email}"
}

# VM Instance
resource "google_compute_instance" "web" {
  name         = "${var.project_name}-${var.environment}-web"
  machine_type = var.machine_type
  zone         = var.zone

  description = "${var.project_name} web server for ${var.environment} environment"

  tags = ["web-server", var.environment]

  boot_disk {
    initialize_params {
      image = data.google_compute_image.ubuntu.self_link
      size  = var.boot_disk_size
      type  = var.boot_disk_type
      labels = merge(
        {
          environment = var.environment
          project     = var.project_name
        },
        var.labels
      )
    }
  }

  network_interface {
    network    = google_compute_network.main.self_link
    subnetwork = google_compute_subnetwork.public.self_link

    access_config {
      nat_ip = google_compute_address.web_static_ip.address
    }
  }

  service_account {
    email = google_service_account.vm_service_account.email
    scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring.write",
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }

  metadata = {
    ssh-keys       = "${var.ssh_user}:${file(var.ssh_public_key_path)}"
    enable-oslogin = var.enable_os_login
    startup-script = templatefile("${path.module}/startup-script.sh", {
      project_name = var.project_name
      environment  = var.environment
      ssh_user     = var.ssh_user
    })
  }

  allow_stopping_for_update = true

  labels = merge(
    {
      environment = var.environment
      project     = var.project_name
      terraform   = "true"
    },
    var.labels
  )

  lifecycle {
    ignore_changes = [metadata["startup-script"]]
  }
}

# Cloud NAT Router
resource "google_compute_router" "nat_router" {
  name    = "${var.project_name}-${var.environment}-nat-router"
  region  = var.region
  network = google_compute_network.main.id

  description = "NAT router for ${var.project_name} ${var.environment}"
}

# Cloud NAT
resource "google_compute_router_nat" "nat" {
  name                               = "${var.project_name}-${var.environment}-nat"
  router                             = google_compute_router.nat_router.name
  region                             = var.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# Health Check
resource "google_compute_health_check" "web_health_check" {
  name        = "${var.project_name}-${var.environment}-health-check"
  description = "Health check for ${var.project_name} web application"

  timeout_sec        = 5
  check_interval_sec = 10

  http_health_check {
    port         = "80"
    request_path = "/health"
  }
}