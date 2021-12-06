// kubelabs.tk
# resource "google_dns_managed_zone" "kubelabs_tk" {
#   name        = "kubelabs-tk"
#   dns_name    = "kubelabs.tk."
#   description = "Docker labs GCP testing zone"
#   labels = {
#     env = "dev"
#   }
# }

resource "google_dns_record_set" "kubelabs_tk" {
  count      = var.instance_count
  name       = format("%s%s.%s.%s.", var.subdomain, count.index + 9, var.domain, "tk")

  type         = "A"
  ttl          = 300
  managed_zone = var.domain
  rrdatas      = [google_compute_instance.kube[count.index].network_interface.0.access_config.0.nat_ip]
}

resource "google_dns_record_set" "api_kubelabs_tk" {
  count      = var.instance_count
  name       = format("api.%s%s.%s.%s.", var.subdomain, count.index + 9, var.domain, "tk")

  type         = "A"
  ttl          = 300
  managed_zone = var.domain
  rrdatas      = [google_compute_instance.kube[count.index].network_interface.0.access_config.0.nat_ip]
}

resource "google_dns_record_set" "www_kube_kubelabs_tk" {
  count      = var.instance_count
  name       = format("www.%s%s.%s.%s.", var.subdomain, count.index + 9, var.domain, "tk")

  type         = "A"
  ttl          = 300
  managed_zone = var.domain
  rrdatas      = [google_compute_instance.kube[count.index].network_interface.0.access_config.0.nat_ip]
}

# resource "google_dns_record_set" "www_kubelabs_tk" {
#   count      = var.instance_count
#   name       = format("www.%s.%s.", var.domain, "tk")

#   type         = "A"
#   ttl          = 300
#   managed_zone = var.domain
#   rrdatas      = [google_compute_instance.kube[count.index].network_interface.0.access_config.0.nat_ip]
# }





