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

## SSL / TLS

### limpiar certificados antiguos
```vim
kubectl delete letsencrypt-staging
kubectl delete letsencrypt-prod
kubectl delete issuers.cert-manager.io letsencrypt-staging
kubectl delete issuers.cert-manager.io letsencrypt-prod
```

### Let's Encrypt
[production_clusterIssuer.yaml](../../kubelabs-files-demo/20/demo/manifest/clusterIssuer/production_clusterIssuer.yaml)
[staging_clusterIssuer.yaml](../../kubelabs-files-demo/20/demo/manifest/clusterIssuer/staging_clusterIssuer.yaml)
```vim
kubectl apply -f kubelabs-files-demo/20/demo/manifest/clusterIssuer/production_clusterIssuer.yaml
kubectl apply -f kubelabs-files-demo/20/demo/manifest/clusterIssuer/staging_clusterIssuer.yaml
```
### Comprobar los ***clusterIssuer***
```vim
kubectl get clusterissuer.cert-manager.io/letsencrypt-prod
kubectl get clusterissuer.cert-manager.io/letsencrypt-staging
```

# agregar ingress con solicitud del certificado
```vim
```



# check certs:
```yaml
Message:               The ACME account was registered with the ACME server
Reason:                ACMEAccountRegistered
Status:                True
```
kubectl describe issuer letsencrypt-staging
kubectl describe clusterIssuer letsencrypt-staging
# challenge
kubectl describe challenge | grep State
# cert
kubectl describe certificate
# secret
kubectl describe secret <secretName>
#  trouble: cert logs
kubectl logs -n cert-manager deploy/cert-manager -f



