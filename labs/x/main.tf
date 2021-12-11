output "lab-ssh" {
  value = "ssh ${var.username}@${google_compute_instance.kubemaster01.network_interface.0.access_config.0.nat_ip} -i ~/Documents/code/dockerlabs/labs/keys/prod/dockerlabkey"
}

output "kube-config" {
  value = "rsync -Pav -e 'ssh -i ~/Documents/code/dockerlabs/labs/keys/prod/dockerlabkey' ${var.username}@${google_compute_instance.kubemaster01.network_interface.0.access_config.0.nat_ip}:/home/${var.username}/.kube/config ~/.kube/config"
}


output "local-ip" {
	value = google_compute_instance.kubemaster01.network_interface.0.network_ip
}

output "IP-list" {
  value = "${google_compute_instance.kubemaster01.network_interface.0.access_config.0.nat_ip}"
}

output "names" {
  value = google_compute_instance.kubemaster01.name
}

# output "nodes" {
# 	value = local.cluster_nodes

# }


