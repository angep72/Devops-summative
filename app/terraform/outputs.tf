output "acr_login_server" {
  description = "Login server for Azure Container Registry."
  value       = azurerm_container_registry.acr.login_server
}

output "web_app_default_hostname" {
  description = "Default hostname (public URL) of the Azure App Service."
  value       = azurerm_linux_web_app.app_service.default_hostname
}