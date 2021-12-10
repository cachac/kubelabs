# X labs - Kubelabs + Terraform <!-- omit in TOC -->

## Previo, crear ssh keys <!-- omit in TOC -->

## 1. Init
```vim
  depends_on = [google_compute_firewall.k3s_fw_allowall]

terraform init
terraform plan --auto-approve
terraform apply --auto-approve
```

## 2. Comprobar conexión con nodos
```vim
kubectl get nodes -o wide
```

## 3. Ingresar a ArgoCD

```vim
# Pass:
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo

kubemaster01.kubelabs.tk:30088
```

## Ejecutar CI/CD
> [20.CICD.md](./../../20.CICD.md)
> Punto 5. Opcional. Demo 3Tier app
