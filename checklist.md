# Checklist Práctica #2 <!-- omit in TOC -->

# 1. Namespace
- [ ] public
- [ ] private

# 2. Webpage
- [ ] Namespace: public
- [ ] La página web accede correctamente en browser por puerto 80
- [ ] Se montó correctamente el archivo de configuración (config.js)

# 3. Websocket
- [ ] La página conecta con el websocket
- [ ] El TOKEN_SECRET se pasa de forma "segura"

# 4. Public API
- [ ] La página conecta con el api

# 5. Private API
- [ ] El api pÚblico se comunica correctamente con el API privado

# 6. Recursos
- [ ] página web (limits: 100m-100Mi / requests: 10m-50Mi)
- [ ] websocket (limits: 250m-200Mi / requests: 100m-100Mi)
- [ ] public api (limits: 200m-200Mi / requests: 100m-100Mi)
- [ ] private api (limits: 200m-200Mi / requests: 100m-100Mi)

# 7. HealthChecks
- [ ] Websocket: /healthchek, puerto: 3081
- [ ] Public API: /healthchek, puerto: 3080
- [ ] Private API: /healthchek, puerto: 3082

# 8. Logs
## 8.1. Public API
- [ ] Tipo StorageClass - PVC
- [ ] 50 Mi
- [ ] ReadWriteOnce
- [ ] ReclaimPolicy Retain
- [ ] ruta pod: /app/logs
- [ ] Logs en server: /var/snap/microk8s/common/default-storage/<pvc-id>

# 9. Estatégias de deployment

## 9.1. Página web
- [ ] RollingUpdate
- [ ] Pérdida del 50%

## 9.2. Websocket
- [ ] Recreate


# 11. Automatización
- [ ] Los objetos se eliminan con el mínimo esfuerzo
- [ ] Los objetos se crean con el mínimo esfuerzo
