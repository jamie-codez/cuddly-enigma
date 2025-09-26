output "instance_name" {
  description = "Name of the VM instance"
  value       = google_compute_instance.web.name
}

output "instance_id" {
  description = "ID of the VM instance"
  value       = google_compute_instance.web.instance_id
}

output "instance_zone" {
  description = "Zone of the VM instance"
  value       = google_compute_instance.web.zone
}

output "external_ip" {
  description = "External IP address of the VM instance"
  value       = google_compute_address.web_static_ip.address
}

output "internal_ip" {
  description = "Internal IP address of the VM instance"
  value       = google_compute_instance.web.network_interface[0].network_ip
}

output "ssh_connection" {
  description = "SSH connection command"
  value       = "gcloud compute ssh ${google_compute_instance.web.name} --zone=${google_compute_instance.web.zone} --project=${var.project_id}"
}

output "ssh_connection_direct" {
  description = "Direct SSH connection command"
  value       = "ssh -i ~/.ssh/id_rsa ${var.ssh_user}@${google_compute_address.web_static_ip.address}"
}

output "web_url" {
  description = "URL to access the web application"
  value       = "http://${google_compute_address.web_static_ip.address}"
}

output "monitoring_urls" {
  description = "Monitoring dashboard URLs"
  value = {
    prometheus = "http://${google_compute_address.web_static_ip.address}:9090"
    grafana    = "http://${google_compute_address.web_static_ip.address}:3001"
  }
}

output "vpc_network" {
  description = "VPC network name"
  value       = google_compute_network.main.name
}

output "vpc_network_self_link" {
  description = "VPC network self link"
  value       = google_compute_network.main.self_link
}

output "subnet" {
  description = "Subnet name"
  value       = google_compute_subnetwork.public.name
}

output "subnet_self_link" {
  description = "Subnet self link"
  value       = google_compute_subnetwork.public.self_link
}

output "service_account_email" {
  description = "Service account email"
  value       = google_service_account.vm_service_account.email
}

output "project_id" {
  description = "GCP project ID"
  value       = var.project_id
}

output "region" {
  description = "GCP region"
  value       = var.region
}

output "firewall_rules" {
  description = "Created firewall rules"
  value = {
    http_https = google_compute_firewall.allow_http_https.name
    ssh        = google_compute_firewall.allow_ssh.name
    monitoring = google_compute_firewall.allow_monitoring.name
  }
}