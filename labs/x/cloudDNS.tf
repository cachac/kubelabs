// kubelabs.tk
# resource "google_dns_managed_zone" "kubelabs_tk" {
#   name        = "kubelabs-tk"
#   dns_name    = "kubelabs.tk."
#   description = "Docker labs GCP testing zone"
#   labels = {
#     env = "dev"
#   }
# }

# control plane
resource "google_dns_record_set" "kubelabs_tk" {
  name       = format("%s.%s.%s.", var.master01_name, var.domain, "tk")

  type         = "A"
  ttl          = 300
  managed_zone = var.domain
  rrdatas      = [google_compute_instance.kubemaster01.network_interface.0.access_config.0.nat_ip]
}

# apps

resource "google_dns_record_set" "kube_apps_tk" {
  name       = "kube-apps.tk"

  type         = "A"
  ttl          = 300
  managed_zone = var.domain
  rrdatas      = [google_compute_instance.kubeworker01.network_interface.0.access_config.0.nat_ip, google_compute_instance.kubeworker02.network_interface.0.access_config.0.nat_ip]
}

resource "google_dns_record_set" "www_kube_apps_tk" {
  name       = "www.kube-apps.tk"

  type         = "A"
  ttl          = 300
  managed_zone = var.domain
  rrdatas      = [google_compute_instance.kubeworker01.network_interface.0.access_config.0.nat_ip, google_compute_instance.kubeworker02.network_interface.0.access_config.0.nat_ip]
}

resource "google_dns_record_set" "api_kube_apps_tk" {
  name       = "api.kube-apps.tk"

  type         = "A"
  ttl          = 300
  managed_zone = var.domain
  rrdatas      = [google_compute_instance.kubeworker01.network_interface.0.access_config.0.nat_ip, google_compute_instance.kubeworker02.network_interface.0.access_config.0.nat_ip]
}








