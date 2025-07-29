terraform {
  required_version = ">= 1.3.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# --- Azure Resource Group ---
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = "Development"
    Project     = var.app_name
  }
}

# --- Azure Container Registry (ACR) ---
resource "azurerm_container_registry" "acr" {
  name                = "${replace(var.app_name, "-", "")}acr"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = var.acr_sku
  admin_enabled       = true

  tags = {
    Environment = "Development"
    Project     = var.app_name
  }
}

# --- Azure Service Plan (Linux, for containers) ---
resource "azurerm_service_plan" "app_plan" {
  name                = "${var.app_name}-plan"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = var.app_service_plan_sku_name

  tags = {
    Environment = "Development"
    Project     = var.app_name
  }
}

# --- Azure Linux Web App (React frontend) ---
resource "azurerm_linux_web_app" "app_service" {
  name                = "${var.app_name}-service"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  service_plan_id     = azurerm_service_plan.app_plan.id

  site_config {
    always_on        = true
    app_command_line = ""  # optional, depends on your container
  }

  app_settings = {
    "DOCKER_CUSTOM_IMAGE_NAME"        = "${azurerm_container_registry.acr.login_server}/personal-tracker-frontend-image:latest"
    "DOCKER_REGISTRY_SERVER_URL"      = "https://${azurerm_container_registry.acr.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME" = azurerm_container_registry.acr.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD" = azurerm_container_registry.acr.admin_password
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false" # optional, depends on your setup
  }

  https_only = true

  tags = {
    Environment = "Development"
    Project     = var.app_name
  }
}


