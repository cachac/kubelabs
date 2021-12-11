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
kubectl get clusterIssuer
kubectl describe clusterissuer.cert-manager.io/letsencrypt-prod
kubectl describe clusterissuer.cert-manager.io/letsencrypt-staging
```
Resultado:
```yaml
Message:               The ACME account was registered with the ACME server
Reason:                ACMEAccountRegistered
Status:                True
```

### Agregar ingress con solicitud del certificado
[web-ingress.yml](./../../kubelabs-files-demo/20/demo/manifest/web-ingress.yml)
Agregar al ingress, los datos del certificado:
```yaml
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
```
```yaml
  tls:
  - hosts:
    - kube-apps.tk
    - www.kube-apps.tk
    secretName: kube-apps-tk-tls
```

### Pull-Request
> hacer pull request a los cambios
### Comprobar certificados
```vim
kubectl describe ingress -n ci in-web | grep Events -A10
```
Resultado:
```yaml
Events:
Type    Reason             Age                  From                      Message
----    ------             ----                 ----                      -------
Normal  CreateCertificate  5m31s                cert-manager              Successfully created Certificate "kube-apps-tk-tls"
```
```vim
kubectl get certificate -n ci

kubectl describe certificate -n ci | grep Events -A10
```
Resultado:
```yaml
NAME               READY   SECRET             AGE
kube-apps-tk-tls   True    kube-apps-tk-tls   7m4s
```
```yaml
Events:
  Type    Reason     Age    From          Message
  ----    ------     ----   ----          -------
  Normal  Issuing    8m40s  cert-manager  Issuing certificate as Secret does not exist
  Normal  Generated  8m40s  cert-manager  Stored new private key in temporary Secret resource "kube-apps-tk-tls-dn52p"
  Normal  Requested  8m40s  cert-manager  Created new CertificateRequest resource "kube-apps-tk-tls-hjtzw"
  Normal  Issuing    8m12s  cert-manager  The certificate has been successfully issued
```
> ***The certificate has been successfully issued***

Ver el certificado creado en el ***secret***
```vim
kubectl get secret -n ci
```
Resultado:
```vim
NAME                  TYPE                                  DATA   AGE
kube-apps-tk-tls      kubernetes.io/tls                     2      12m
```



# check certs:
kubectl describe issuer letsencrypt-staging
# challenge
kubectl describe challenge | grep State
###  trouble: cert logs
kubectl logs -n cert-manager deploy/cert-manager -f



