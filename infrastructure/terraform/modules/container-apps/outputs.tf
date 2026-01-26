output "environment_id" {
  description = "ID of the Container App Environment"
  value       = azurerm_container_app_environment.main.id
}

output "environment_name" {
  description = "Name of the Container App Environment"
  value       = azurerm_container_app_environment.main.name
}

output "api_id" {
  description = "ID of the API Container App"
  value       = azurerm_container_app.api.id
}

output "api_name" {
  description = "Name of the API Container App"
  value       = azurerm_container_app.api.name
}

output "api_fqdn" {
  description = "FQDN of the API Container App"
  value       = azurerm_container_app.api.ingress[0].fqdn
}

output "api_url" {
  description = "URL of the API Container App"
  value       = "https://${azurerm_container_app.api.ingress[0].fqdn}"
}

output "api_identity_principal_id" {
  description = "Principal ID of the API managed identity"
  value       = azurerm_container_app.api.identity[0].principal_id
}

output "api_latest_revision_name" {
  description = "Name of the latest revision"
  value       = azurerm_container_app.api.latest_revision_name
}
