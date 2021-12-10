# Use latest Ubuntu 20.04 Image
data "google_compute_image" "master_image" {
  family = "ubuntu-2004-lts"
  project = "ubuntu-os-cloud"
}

resource "google_compute_disk" "kube-disk" {
  name  = "kube-disk-default"
  type  = "pd-standard"
  zone  = var.gcp_zone_a
	size = "30"
  labels = {
    environment = "dev"
  }
  physical_block_size_bytes = 4096
}
