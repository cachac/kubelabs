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
  name       = format("%s.%s.%s.", var.master01_name, var.domain, "tk")

  type         = "A"
  ttl          = 300
  managed_zone = var.domain
  rrdatas      = [google_compute_instance.kubemaster01.network_interface.0.access_config.0.nat_ip]
}

# resource "google_dns_record_set" "kubelabs_tk" {
#   name       = format("%s.%s.", var.domain, "tk")

#   type         = "A"
#   ttl          = 300
#   managed_zone = var.domain
#   rrdatas      = [google_compute_instance.kubeworker01.network_interface.0.access_config.0.nat_ip, google_compute_instance.kubeworker02.network_interface.0.access_config.0.nat_ip]
# }

# resource "google_dns_record_set" "www_kubelabs_tk" {
#   name       = format("www.%s.%s.", var.domain, "tk")

#   type         = "A"
#   ttl          = 300
#   managed_zone = var.domain
#   rrdatas      = [google_compute_instance.kubeworker01.network_interface.0.access_config.0.nat_ip, google_compute_instance.kubeworker02.network_interface.0.access_config.0.nat_ip]
# }

# resource "google_dns_record_set" "api_kubelabs_tk" {
#   name       = format("api.%s.%s.", var.domain, "tk")

#   type         = "A"
#   ttl          = 300
#   managed_zone = var.domain
#   rrdatas      = [google_compute_instance.kubeworker01.network_interface.0.access_config.0.nat_ip, google_compute_instance.kubeworker02.network_interface.0.access_config.0.nat_ip]
# }

# resource "google_dns_record_set" "www_kube_kubelabs_tk" {
#   name       = format("www.%s.%s.", var.domain, "tk")

#   type         = "A"
#   ttl          = 300
#   managed_zone = var.domain
#   rrdatas      = [google_compute_instance.kubeworker01.network_interface.0.access_config.0.nat_ip, google_compute_instance.kubeworker02.network_interface.0.access_config.0.nat_ip]
# }







