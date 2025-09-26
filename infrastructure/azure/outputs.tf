output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "resource_group_location" {
  description = "Location of the resource group"
  value       = azurerm_resource_group.main.location
}

output "vm_name" {
  description = "Name of the Virtual Machine"
  value       = azurerm_linux_virtual_machine.web.name
}

output "vm_id" {
  description = "ID of the Virtual Machine"
  value       = azurerm_linux_virtual_machine.web.id
}

output "public_ip_address" {
  description = "Public IP address of the VM"
  value       = azurerm_public_ip.web.ip_address
}

output "private_ip_address" {
  description = "Private IP address of the VM"
  value       = azurerm_network_interface.web.private_ip_address
}

output "fqdn" {
  description = "Fully qualified domain name of the VM"
  value       = azurerm_public_ip.web.fqdn
}

output "ssh_connection" {
  description = "SSH connection command"
  value       = "ssh -i ~/.ssh/id_rsa ${var.admin_username}@${azurerm_public_ip.web.ip_address}"
}

output "web_url" {
  description = "URL to access the web application"
  value       = "http://${azurerm_public_ip.web.ip_address}"
}

output "monitoring_urls" {
  description = "Monitoring dashboard URLs"
  value = {
    prometheus = "http://${azurerm_public_ip.web.ip_address}:9090"
    grafana    = "http://${azurerm_public_ip.web.ip_address}:3001"
  }
}

output "vnet_name" {
  description = "Name of the Virtual Network"
  value       = azurerm_virtual_network.main.name
}

output "vnet_id" {
  description = "ID of the Virtual Network"
  value       = azurerm_virtual_network.main.id
}

output "subnet_name" {
  description = "Name of the subnet"
  value       = azurerm_subnet.public.name
}

output "subnet_id" {
  description = "ID of the subnet"
  value       = azurerm_subnet.public.id
}

output "nsg_name" {
  description = "Name of the Network Security Group"
  value       = azurerm_network_security_group.web.name
}

output "nsg_id" {
  description = "ID of the Network Security Group"
  value       = azurerm_network_security_group.web.id
}

output "location" {
  description = "Azure region"
  value       = var.location
}

output "admin_username" {
  description = "Admin username"
  value       = var.admin_username
}