variable "location" {
  description = "The Azure region to deploy resources."
  type        = string
  default     = "southafricanorth"
}

variable "resource_group_name" {
  description = "Name of the Azure Resource Group."
  type        = string
  default     = "rg-personal-tracker-frontend"
}

variable "app_name" {
  description = "Name for your application resources."
  type        = string
  default     = "personal-tracker-frontend"
}

variable "acr_sku" {
  description = "SKU for Azure Container Registry (Basic, Standard, Premium)."
  type        = string
  default     = "Basic" # Basic is sufficient for this project.
}

variable "app_service_plan_sku_name" {
  description = "SKU for Azure App Service Plan (e.g., B1, S1, P1v3). B1 is Basic tier."
  type        = string
  default     = "B1" # Basic tier, suitable for testing and development.
}