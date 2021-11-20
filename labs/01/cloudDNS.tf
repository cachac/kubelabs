// dockerlabs.tk
# resource "google_dns_managed_zone" "dockerlabs_tk" {
#   name        = "dockerlabs-tk"
#   dns_name    = "dockerlabs.tk."
#   description = "Docker labs GCP testing zone"
#   labels = {
#     env = "dev"
#   }
# }

resource "google_dns_record_set" "dockerlabs_tk" {
  count      = var.instance_count
  name       = format("%s%s.%s.%s.", var.subdomain, count.index + 1, var.domain, "tk")

  type         = "A"
  ttl          = 300
  managed_zone = var.domain
  rrdatas      = [google_compute_instance.kube[count.index].network_interface.0.access_config.0.nat_ip]
}



