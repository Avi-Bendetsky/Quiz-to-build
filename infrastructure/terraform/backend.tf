# Remote state configuration for Azure Storage
# Uncomment and configure after creating the storage account
#
# terraform {
#   backend "azurerm" {
#     resource_group_name  = "rg-terraform-state"
#     storage_account_name = "stterraformstate"
#     container_name       = "tfstate"
#     key                  = "questionnaire.dev.tfstate"
#   }
# }

# For initial setup, use local state
# After creating the storage account, migrate state using:
# terraform init -migrate-state
