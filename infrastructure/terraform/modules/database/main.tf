# Database Module - Azure Database for PostgreSQL Flexible Server

resource "random_password" "postgres" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "azurerm_postgresql_flexible_server" "main" {
  name                   = "psql-${var.project_name}-${var.environment}"
  resource_group_name    = var.resource_group_name
  location               = var.location
  version                = var.postgresql_version
  delegated_subnet_id    = var.subnet_id
  private_dns_zone_id    = var.private_dns_zone_id
  administrator_login    = "psqladmin"
  administrator_password = random_password.postgres.result
  zone                   = "1"
  storage_mb             = var.storage_mb
  sku_name               = var.sku_name
  backup_retention_days  = 7

<<<<<<< Local
  # High availability disabled for dev - uncomment for production:
  # high_availability {
  #   mode = "ZoneRedundant"
  # }

  tags = var.tags

  lifecycle {
    ignore_changes = [
      zone
    ]
=======
  # high_availability {
  #   mode = "ZoneRedundant" # Enable for production
  # }

  tags = var.tags

  lifecycle {
    ignore_changes = [
      zone,
      high_availability[0].standby_availability_zone
    ]
>>>>>>> Remote
  }
}

resource "azurerm_postgresql_flexible_server_database" "main" {
  name      = var.db_name
  server_id = azurerm_postgresql_flexible_server.main.id
  collation = "en_US.utf8"
  charset   = "UTF8"
}

# Configure server parameters for better performance
resource "azurerm_postgresql_flexible_server_configuration" "timezone" {
  name      = "timezone"
  server_id = azurerm_postgresql_flexible_server.main.id
  value     = "UTC"
}

resource "azurerm_postgresql_flexible_server_configuration" "log_connections" {
  name      = "log_connections"
  server_id = azurerm_postgresql_flexible_server.main.id
  value     = "on"
}

resource "azurerm_postgresql_flexible_server_configuration" "log_disconnections" {
  name      = "log_disconnections"
  server_id = azurerm_postgresql_flexible_server.main.id
  value     = "on"
}
