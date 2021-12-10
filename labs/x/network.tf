
# Networking
resource "google_compute_network" "kube_network" {
  name = "kube-network"
}

resource "google_compute_subnetwork" "kube_subnet" {
  name          = "kube-subnet"
  ip_cidr_range = "10.0.0.0/16"
  region        = var.gcp_region
  network       = google_compute_network.kube_network.id
}

resource "google_compute_address" "master_internal_address" {
  name         = "master-internal-address"
  subnetwork   = google_compute_subnetwork.kube_subnet.id
  address_type = "INTERNAL"
  address      = "10.0.0.11"
  region       = var.gcp_region
}

resource "google_compute_address" "master_external_address" {
  name   = "master"
  region = var.gcp_region
}

resource "google_compute_address" "worker01_internal_address" {
  name         = "worker01-internal-address"
  subnetwork   = google_compute_subnetwork.kube_subnet.id
  address_type = "INTERNAL"
  address      = "10.0.0.101"
  region       = var.gcp_region
}

resource "google_compute_address" "worker01_external_address" {
  name   = "worker02"
  region = var.gcp_region
}

resource "google_compute_address" "worker02_internal_address" {
  name         = "worker02-internal-address"
  subnetwork   = google_compute_subnetwork.kube_subnet.id
  address_type = "INTERNAL"
  address      = "10.0.0.102"
  region       = var.gcp_region
}

resource "google_compute_address" "worker02_external_address" {
  name   = "worker02"
  region = var.gcp_region
}

# ********** WARNING **********
# Firewall Rule to allow all traffic
resource "google_compute_firewall" "kube_fw_allowall" {
  name    = "${var.prefix}kube-allowall"
  network = google_compute_network.kube_network.id

  allow {
    protocol = "all"
  }

  source_ranges = ["0.0.0.0/0"]
}
