terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

# Data Sources
data "azurerm_client_config" "current" {}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = merge(
    {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    },
    var.tags
  )
}

# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = "${var.project_name}-${var.environment}-vnet"
  address_space       = var.vnet_address_space
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = merge(
    {
      Environment = var.environment
      Project     = var.project_name
    },
    var.tags
  )
}

# Public Subnet
resource "azurerm_subnet" "public" {
  name                 = "${var.project_name}-${var.environment}-public-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = var.subnet_address_prefixes
}

# Private Subnet (for future use)
resource "azurerm_subnet" "private" {
  name                 = "${var.project_name}-${var.environment}-private-subnet"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes = ["10.0.2.0/24"]
}

# Public IP
resource "azurerm_public_ip" "web" {
  name                = "${var.project_name}-${var.environment}-pip"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                 = "Standard"
  domain_name_label   = "${var.project_name}-${var.environment}-${random_string.suffix.result}"

  tags = merge(
    {
      Environment = var.environment
      Project     = var.project_name
    },
    var.tags
  )
}

# Random string for unique DNS name
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# Network Security Group
resource "azurerm_network_security_group" "web" {
  name                = "${var.project_name}-${var.environment}-nsg"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  # HTTP
  security_rule {
    name                       = "HTTP"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefixes    = var.allowed_source_address_prefixes
    destination_address_prefix = "*"
  }

  # HTTPS
  security_rule {
    name                       = "HTTPS"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefixes    = var.allowed_source_address_prefixes
    destination_address_prefix = "*"
  }

  # SSH
  security_rule {
    name                       = "SSH"
    priority                   = 1003
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefixes    = var.allowed_source_address_prefixes
    destination_address_prefix = "*"
  }

  # Application
  security_rule {
    name                       = "Application"
    priority                   = 1004
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3000"
    source_address_prefixes    = var.allowed_source_address_prefixes
    destination_address_prefix = "*"
  }

  # Monitoring - Prometheus
  security_rule {
    name                       = "Prometheus"
    priority                   = 1005
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "9090"
    source_address_prefixes    = var.allowed_source_address_prefixes
    destination_address_prefix = "*"
  }

  # Monitoring - Grafana
  security_rule {
    name                       = "Grafana"
    priority                   = 1006
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3001"
    source_address_prefixes    = var.allowed_source_address_prefixes
    destination_address_prefix = "*"
  }

  # Monitoring - Node Exporter
  security_rule {
    name                       = "NodeExporter"
    priority                   = 1007
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "9100"
    source_address_prefixes    = var.allowed_source_address_prefixes
    destination_address_prefix = "*"
  }

  tags = merge(
    {
      Environment = var.environment
      Project     = var.project_name
    },
    var.tags
  )
}

# Network Interface
resource "azurerm_network_interface" "web" {
  name                          = "${var.project_name}-${var.environment}-nic"
  location                      = azurerm_resource_group.main.location
  resource_group_name           = azurerm_resource_group.main.name
  enable_accelerated_networking = var.enable_accelerated_networking

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.public.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.web.id
  }

  tags = merge(
    {
      Environment = var.environment
      Project     = var.project_name
    },
    var.tags
  )
}

# Associate Network Security Group to Network Interface
resource "azurerm_network_interface_security_group_association" "web" {
  network_interface_id      = azurerm_network_interface.web.id
  network_security_group_id = azurerm_network_security_group.web.id
}

# Storage Account for boot diagnostics
resource "azurerm_storage_account" "boot_diagnostics" {
  name                     = "${replace(var.project_name, "-", "")}${var.environment}diag${random_string.suffix.result}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2"

  tags = merge(
    {
      Environment = var.environment
      Project     = var.project_name
    },
    var.tags
  )
}

# User Assigned Managed Identity
resource "azurerm_user_assigned_identity" "vm_identity" {
  name                = "${var.project_name}-${var.environment}-vm-identity"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = merge(
    {
      Environment = var.environment
      Project     = var.project_name
    },
    var.tags
  )
}

# Role assignment for managed identity
resource "azurerm_role_assignment" "vm_contributor" {
  scope                = azurerm_resource_group.main.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_user_assigned_identity.vm_identity.principal_id
}

# Virtual Machine
resource "azurerm_linux_virtual_machine" "web" {
  name                            = "${var.project_name}-${var.environment}-vm"
  resource_group_name             = azurerm_resource_group.main.name
  location                        = azurerm_resource_group.main.location
  size                            = var.vm_size
  admin_username                  = var.admin_username
  disable_password_authentication = true

  network_interface_ids = [
    azurerm_network_interface.web.id,
  ]

  admin_ssh_key {
    username = var.admin_username
    public_key = file(var.ssh_public_key_path)
  }

  identity {
    type = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.vm_identity.id]
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = var.os_disk_type
    disk_size_gb         = var.os_disk_size_gb

    name = "${var.project_name}-${var.environment}-os-disk"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts-gen2"
    version   = "latest"
  }

  boot_diagnostics {
    storage_account_uri = azurerm_storage_account.boot_diagnostics.primary_blob_endpoint
  }

  custom_data = base64encode(templatefile("${path.module}/cloud-init.yml", {
    project_name   = var.project_name
    environment    = var.environment
    admin_username = var.admin_username
  }))

  tags = merge(
    {
      Environment = var.environment
      Project     = var.project_name
    },
    var.tags
  )
}

# Azure Monitor Data Collection Rule (optional)
resource "azurerm_monitor_data_collection_rule" "vm_monitoring" {
  name                = "${var.project_name}-${var.environment}-dcr"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  destinations {
    azure_monitor_metrics {
      name = "azure-monitor-metrics"
    }
  }

  data_flow {
    streams = ["Microsoft-InsightsMetrics"]
    destinations = ["azure-monitor-metrics"]
  }

  data_sources {
    performance_counter {
      streams = ["Microsoft-InsightsMetrics"]
      sampling_frequency_in_seconds = 60
      counter_specifiers = [
        "\\Processor Information(_Total)\\% Processor Time",
        "\\Processor Information(_Total)\\% Privileged Time",
        "\\Processor Information(_Total)\\% User Time",
        "\\Processor Information(_Total)\\Processor Frequency",
        "\\System\\Processes",
        "\\Process(_Total)\\Thread Count",
        "\\Process(_Total)\\Handle Count",
        "\\System\\System Up Time",
        "\\System\\Context Switches/sec",
        "\\System\\Processor Queue Length",
        "\\Memory\\% Committed Bytes In Use",
        "\\Memory\\Available Bytes",
        "\\Memory\\Committed Bytes",
        "\\Memory\\Cache Bytes",
        "\\Memory\\Pool Paged Bytes",
        "\\Memory\\Pool Nonpaged Bytes",
        "\\Memory\\Pages/sec",
        "\\Memory\\Page Faults/sec",
        "\\Process(_Total)\\Working Set",
        "\\Process(_Total)\\Working Set - Private"
      ]
      name = "perfCounterDataSource60"
    }
  }

  tags = merge(
    {
      Environment = var.environment
      Project     = var.project_name
    },
    var.tags
  )
}

# Log Analytics Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "${var.project_name}-${var.environment}-law"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = merge(
    {
      Environment = var.environment
      Project     = var.project_name
    },
    var.tags
  )
}