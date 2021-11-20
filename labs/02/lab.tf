resource "google_compute_instance" "lab" {
  count        = var.instance_count
  name         = "${var.subdomain}-${count.index + 9}"
  machine_type = var.machine_type
  zone         = var.gcp_zone_a
  tags         = ["dockerlabs"]
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
    network = "default"
    access_config {}
  }

  metadata = {
    # ssh-keys = "${var.username}:${tls_private_key.global_key.public_key_openssh}"
    ssh-keys = "${var.username}:${file(var.ssh_pub_key)}"
    user-data = templatefile("../conf/template.sh",
      {
        username = var.username
    })
  }
}
