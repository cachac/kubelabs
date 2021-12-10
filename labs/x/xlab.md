# X labs - Kubelabs + Terraform <!-- omit in TOC -->

## Previo, crear ssh keys <!-- omit in TOC -->

## 1. Init
```vim
  depends_on = [google_compute_firewall.k3s_fw_allowall]

terraform init
terraform plan --auto-approve
terraform apply --auto-approve
```

