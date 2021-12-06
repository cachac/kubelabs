# Use latest Ubuntu 20.04 Image
data "google_compute_image" "master_image" {
  family = "ubuntu-2004-lts"
  project = "ubuntu-os-cloud"
}

resource "google_compute_disk" "kube-vol" {
  name  = "kube-disk"
  type  = "pd-standard"
  zone  = var.gcp_zone_a
  # image = "debian-9-stretch-v20200805"
	size = "10"
  labels = {
    environment = "dev"
  }
  physical_block_size_bytes = 4096
}
