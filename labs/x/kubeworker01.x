resource "google_compute_address" "worker01_external_address" {
  name   = "worker01"
  region = var.gcp_region
}

resource "google_compute_instance" "kubeworker01" {
  depends_on = [google_compute_instance.kubemaster01]

  name         = "worker01"
  machine_type = var.machine_type
  zone         = var.gcp_zone_a
  tags         = ["kubelabs"]
  labels = merge({
    name = var.subdomain
    },
    var.default_tags
  )

  boot_disk {
    initialize_params {
      image = data.google_compute_image.master_image.self_link
      size  = var.disk_size
      type  = var.disk_type

      labels = merge({
        name = var.subdomain
        },
        var.default_tags
      )
    }
  }

  network_interface {
    network    = "default"

    access_config {
      nat_ip = google_compute_address.worker01_external_address.address
    }
  }

  metadata = {
    ssh-keys = "${var.username}:${file(var.ssh_pub_key)}"
    user-data = templatefile("../conf/templateha.sh",
    {
			username = var.username
			external_ip = google_compute_address.worker01_external_address.address
    })
  }
}


