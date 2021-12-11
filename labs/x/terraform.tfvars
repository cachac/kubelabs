gcp_account_json = "../keys/prod/kubelabs_key.json"
ssh_pub_key = "../keys/prod/kubelabkey.pub"
ssh_key = "../keys/prod/kubelabkey"

# Project to deploy resources into
gcp_project = "dockerlabs-332203"

# GCP region for all resources
gcp_region = "us-east1"

# GCP zone for all resources
gcp_zone_a = "us-east1-b"
gcp_zone_b = "us-east1-c"
gcp_zone_c = "us-east1-d"

# Prefix for all resources
prefix = "demo-"

# Compute instance size of all created instances
# 1cpu-600mb
# machine_type = "f1-micro"
# 1cpu-1.7gb = $13.80
# machine_type = "g1-small"
# 2cpu-1gb = 7.99
# machine_type = "e2-micro"
# 2cpu-2ram = $12.23
# machine_type = "e2-small"
# 2cpu-4ram = $28.65
machine_type = "e2-medium"
# 2cpu-8ram = $56.19
# machine_type = "e2-standard-2"

# Disk
disk_size = "30"
disk_type = "pd-standard"

# control plane domain
domain       = "kubelabs"
subdomain    = "demo"
# app demo domain
app_domain   = "kube-apps"

username     = "demo"
fullname     = "Carlos Ch"
host_prefix  = "demo"
vpc_name     = "kubelabs-network"
vpc_ip_range = "20.0.0.0/24"
ip_lab       = "20.0.0.11"
fw_name      = "fw-kubelabs"

master01_name = "kubemaster01"
master02_name = "kubemaster02"
worker01_name = "kubeworker01"
worker02_name = "kubeworker02"


default_tags = {
  team = "cenfotec"
  user = "demo"
  env  = "dev"
}



