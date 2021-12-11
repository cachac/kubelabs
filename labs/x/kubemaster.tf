# locals {
#   cluster_nodes = join(" ", [var.master01_name, /*var.master02_name,*/ var.worker01_name, var.worker02_name])
# }


resource "google_compute_instance" "kubemaster01" {
  name         = var.master01_name
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
    network_ip = google_compute_address.master01_internal_address.address

    access_config {
      nat_ip = google_compute_address.master01_external_address.address
    }
  }

  metadata = {
    ssh-keys = "${var.username}:${file(var.ssh_pub_key)}"
    user-data = templatefile("../conf/template_rke.sh",
      {
        username  = var.username
        NODE_NAME = var.worker02_name
        ROLE      = "master"
        CLUSTER_NODES = join(" ", [
          google_compute_address.master01_external_address.address,
          google_compute_address.worker01_external_address.address,
          google_compute_address.worker02_external_address.address
        ])

        NODE_PUBLIC_IP = google_compute_address.master01_external_address.address

        MASTER_PUBLIC_IP_01  = google_compute_address.master01_external_address.address
        MASTER_PRIVATE_IP_01 = google_compute_address.master01_internal_address.address

        WORKER_PUBLIC_IP_01  = google_compute_address.worker01_external_address.address
        WORKER_PRIVATE_IP_01 = google_compute_address.worker01_internal_address.address

        WORKER_PUBLIC_IP_02  = google_compute_address.worker02_external_address.address
        WORKER_PRIVATE_IP_02 = google_compute_address.worker02_internal_address.address
    })
  }

  provisioner "file" {
    source      = "../conf/rke-cluster.yml"
    destination = "/home/${var.username}/rke-cluster.yml"

    connection {
      type        = "ssh"
      host        = self.network_interface.0.access_config.0.nat_ip
      user        = var.username
      private_key = file(var.ssh_key)
    }
  }

  provisioner "file" {
    source      = "../conf/argocd-nodePort.yml"
    destination = "/home/${var.username}/argocd-nodePort.yml"

    connection {
      type        = "ssh"
      host        = self.network_interface.0.access_config.0.nat_ip
      user        = var.username
      private_key = file(var.ssh_key)
    }
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

  provisioner "local-exec" {
    command = <<EOT
			ssh-keygen -f ~/.ssh/known_hosts -R "${google_compute_instance.kubemaster01.network_interface.0.access_config.0.nat_ip}"
			mkdir ~/.kube
			cp ~/.kube/config ~/.kube/config.bak
			rsync -Pav -e "ssh -i ~/Documents/code/dockerlabs/labs/keys/prod/dockerlabkey -o StrictHostKeyChecking=no" ${var.username}@${google_compute_instance.kubemaster01.network_interface.0.access_config.0.nat_ip}:/home/${var.username}/.kube/config ~/.kube/config
		EOT
  }
}
