variable "gcp_account_json" {
  type        = string
  description = "File path and name of service account access token file."
}

variable "ssh_pub_key" {
  type        = string
  description = "File path of ssh public key"
}

variable "ssh_key" {
  type        = string
  description = "File path of ssh private key"
}

variable "gcp_project" {
  type        = string
  description = "GCP project in which the quickstart will be deployed."
}

variable "gcp_region" {
  type        = string
  description = "GCP region used for all resources."
  default     = "us-east1"
}

variable "gcp_zone_a" {
  type        = string
  description = "GCP AZ"
}

variable "gcp_zone_b" {
  type        = string
  description = "GCP AZ"
}

variable "gcp_zone_c" {
  type        = string
  description = "GCP AZ"
}

variable "prefix" {
  type        = string
  description = "Prefix added to names of all resources"
  default     = "dockerlabs"
}

variable "machine_type" {
  type        = string
  description = "Machine type used for all compute instances"
  default     = "f1-micro"
}

variable "disk_size" {
  type        = string
  description = "DB Disk size"
}

variable "disk_type" {
  type        = string
  description = "DB Disk type"
}

variable "domain" {
  type        = string
  description = "domain"
  default     = "dockerlabs.tk"
}

variable "subdomain" {
  type = string
}

variable "app_domain" {
  type        = string
  description = "application domain"
  default     = "kube-apps.tk"
}

variable "username" {
  type        = string
  description = "Username of servers."
}

variable "fullname" {
  type        = string
  description = "User's fullname."
}

variable "host_prefix" {
  type        = string
  description = "hostname prefix"
}

variable "vpc_name" {
  type = string
}

variable "vpc_ip_range" {
  type = string
}

variable "fw_name" {
  type = string
}

variable "ip_lab" {
  type = string
}

variable "default_tags" {
  type        = map(any)
  description = "AWS tags."
}

variable "master01_name" {
  type = string
}
variable "master02_name" {
  type = string
}
variable "worker01_name" {
  type = string
}
variable "worker02_name" {
  type = string
}


