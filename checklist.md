# 1. Checklist Práctica #2 <!-- omit in TOC -->

# 2. Namespace
- [ ] public
- [ ] private

# 3. Webpage
- [ ] Namespace: public
- [ ] La página web accede correctamente en browser por puerto 80
- [ ] Se montó correctamente el archivo de configuración (config.js)

# 4. Websocket
- [ ] La página conecta con el websocket
- [ ] El TOKEN_SECRET se pasa de forma "segura"

# 5. Public API
- [ ] La página conecta con el api

# 6. Private API
- [ ] El api pÚblico se comunica correctamente con el API privado

# 7. Recursos
- [ ] página web (limits: 100m-100Mi / requests: 10m-50Mi)
- [ ] websocket (limits: 250m-200Mi / requests: 100m-100Mi)
- [ ] public api (limits: 200m-200Mi / requests: 100m-100Mi)
- [ ] private api (limits: 200m-200Mi / requests: 100m-100Mi)

# 8. HealthChecks
- [ ] Websocket: /healthchek, puerto: 3081
- [ ] Public API: /healthchek, puerto: 3080
- [ ] Private API: /healthchek, puerto: 3082

# 9. Estatégias de deployment

## 9.1. Página web
- [ ] RollingUpdate
- [ ] Pérdida del 50%

## 9.2. Websocket
- [ ] Recreate


# 10. Automatización
- [ ] Los objetos se eliminan con el mínimo esfuerzo
- [ ] Los objetos se crean con el mínimo esfuerzo

# 11. Extras
## 11.1. Logs
- [ ] Tipo StorageClass - PVC
- [ ] 50 Mi
- [ ] ReadWriteOnce
- [ ] ruta pod: /app/logs

## 11.2. HPA
- [ ] Los pod escalan automaticamente
