# resource "google_compute_address" "kube_internal_address01" {
#   name         = "kube-internal-address01"
#   # subnetwork   = google_compute_subnetwork.k3s_subnet.id
#   address_type = "INTERNAL"
#   # address      = format("%s.%s","10.0.0.", count.index + 11)
#   region       = var.gcp_region
# }

resource "google_compute_address" "kube_external_address" {
  count = var.instance_count
  # name   = "kube-external-address01"
  name   = "${var.subdomain}-${count.index + 1}"
  region = var.gcp_region
}
resource "google_compute_instance" "kube" {
  count        = var.instance_count
  name         = "${var.subdomain}-${count.index + 1}"
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

  # network_interface {
  #   network = "default"
  #   access_config {}
  # }

	  network_interface {
    network    = "default"

    access_config {
      nat_ip = google_compute_address.kube_external_address[count.index].address
    }
  }

  metadata = {
    # ssh-keys = "${var.username}:${tls_private_key.global_key.public_key_openssh}"
    ssh-keys = "${var.username}:${file(var.ssh_pub_key)}"
    user-data = templatefile("../conf/template.sh",
      {
        username = var.username
        external_ip = google_compute_address.kube_external_address[count.index].address
    })
  }
  provisioner "file" {
    source      = "../conf/.kubectl_aliases"
    destination = "/home/${var.username}/.kubectl_aliases"

    connection {
      type        = "ssh"
      host        = self.network_interface.0.access_config.0.nat_ip
      user        = var.username
      private_key = file(var.ssh_key)
    }
  }

	provisioner "file" {
    source      = "../conf/kubecolor.sh"
    destination = "/home/${var.username}/kubecolor.sh"

    connection {
      type        = "ssh"
      host        = self.network_interface.0.access_config.0.nat_ip
      user        = var.username
      private_key = file(var.ssh_key)
    }
  }
}


