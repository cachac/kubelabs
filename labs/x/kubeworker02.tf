resource "google_compute_instance" "kubeworker02" {
  name         = var.worker02_name
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
    network    = google_compute_network.kube_network.id
    subnetwork = google_compute_subnetwork.kube_subnet.id
    network_ip = google_compute_address.worker02_internal_address.address

    access_config {
      nat_ip = google_compute_address.worker02_external_address.address
    }
  }

  metadata = {
    ssh-keys = "${var.username}:${file(var.ssh_pub_key)}"
    user-data = templatefile("../conf/template_rke.sh",
      {
        username             = var.username
        NODE_PUBLIC_IP       = google_compute_address.worker01_external_address.address
        MASTER_PUBLIC_IP_01  = google_compute_address.worker01_external_address.address
        MASTER_PRIVATE_IP_01 = google_compute_address.worker01_internal_address.address
        WORKER_PUBLIC_IP_01  = google_compute_address.worker01_external_address.address
        WORKER_PRIVATE_IP_01 = google_compute_address.worker01_internal_address.address
        WORKER_PUBLIC_IP_02  = google_compute_address.worker02_external_address.address
        WORKER_PRIVATE_IP_02 = google_compute_address.worker02_internal_address.address
    })
  }

  provisioner "remote-exec" {
    inline = [
      "echo 'Waiting for cloud-init to complete...'",
      "cloud-init status --wait > /dev/null",
      "echo 'Completed cloud-init!!'"
    ]

    connection {
      type        = "ssh"
      host        = self.network_interface.0.access_config.0.nat_ip
      user        = var.username
      private_key = file(var.ssh_key)
    }
  }
}


