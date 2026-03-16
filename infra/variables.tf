variable "subscription_id" {
  type        = string
  description = "Azure Subscription ID"
}

variable "resource_group_name" {
  type        = string
  default     = "relio-rg"
  description = "Existing resource group name"
}

variable "location" {
  type        = string
  default     = "swedencentral"
  description = "Azure region"
}

variable "environment" {
  type        = string
  default     = "dev"
  description = "Environment name (dev, staging, prod)"
}

variable "tags" {
  type = map(string)
  default = {
    project     = "relio"
    environment = "dev"
    managed_by  = "terraform"
  }
}

variable "postgres_password" {
  type        = string
  sensitive   = true
  description = "PostgreSQL admin password"
}
