# 13 Storage <!-- omit in toc -->

> [Documentación Oficial](https://kubernetes.io/docs/concepts/storage/volumes/)
> [Access Modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)

> La configuración de este laboratorio NO debe ser aplicada en ambientes productivos.
>
> La recomendación es utilizar un almacenamiento externo al Worker Node!

# 1. Parte 1: Crear un nuevo Pod pod-storage.yml
> [assets/pod-storage.yml](./assets/pod-storage.yml)

> [hostpath](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-storage
  labels:
    app: pod-storage
spec:
  containers:
    - name: nginx-container
      image: nginx
      ports:
        - containerPort: 80
      volumeMounts:
        - name: static-vol
          mountPath: /usr/share/nginx/html/index.html # destino dentro del Pod
          readOnly: true # solo lectura
          subPath: index.html # evita sobreescribir el contenido completo de .../html/
  volumes:
    - name: static-vol
      hostPath:
        # el PATH debe existir en el WORKER NODE
        # evitar este tipo de Storage y sustituir por algún tipo de Storage fuera del Worker Node.        #
        path: /home/kube/kubelabs/assets/13
---
apiVersion: v1
kind: Service
metadata:
  name: pod-storage-svc
spec:
  type: NodePort
  ports:
    - targetPort: 80
      port: 80
      # nodePort: Si no define el NodePort, Kubernetes asigna un puerto aleatorio entre 30000-32768
  selector:
    app: pod-storage
```

> Revisar configuración de **volumeMounts**

> Revisar configuración de **volumes**

# 2. Ejecutar el pod utilizando el archivo pod-storage.yml
```vim
kubectl apply -f pod-storage.yml
```
> El archivo incluye un ***service*** en un puerto aleatorio

# 3. Validar el volumen montado en el pod

```vim
kubectl describe pods pod-storage
```
En la sección ***Containers*** ver la información del punto de montaje:
~~~~
Containers:
...
Mounts:
	/usr/share/nginx/html/ from static-vol (ro)
~~~~
En la sección ***Volumes*** ver la información del volumen tipo HostPath:
~~~~
Volumes:
  static-vol:
    Type:          HostPath (bare host directory volume)
    Path:          /home/kube/kubelabs/assets/13
~~~~

# 4. Ingresar al pod
```vim
kubectl exec --stdin --tty pod-storage -- /bin/bash
```
## 4.1. Navegar a /usr/share/nginx/html/
Comprobar archivo index.html

## 4.2. Ver logs
```vim
k logs pod-storage

k logs -f pod-storage
```

# 5. Listar el NodePort del pod y probar.
```vim
kubectl describe service pod-storage-svc | grep NodePort

```

# 6. probar en browser (http):

> http://<'ip-public'>:<'nodePort'>

# 7. Opcional, cambiar el contenido del archivo html
Conectar por SSH al servidor y cambiar el contenido del archivo html.

Cambiar la línea 21 del archivo: [assets/13/index.html](./assets/13/index.html)

```vim
nano ~/kubelabs/assets/13/index.html
```
> Salvar y refrescar el browser


# 8. Parte 2. Agregar un volumen persistente tipo HostPath

> [Documentación Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

Para almacenar las salidas de los logs Nginx (/var/nginx/logs), agregar un volumen persistente dentro del Nodo

# 9. Crear el archivo static-pv.yml
> [assets/static-pv.yml](./assets/static-pv.yml)
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: static-pv
spec:
  storageClassName: ""
  claimRef:
    name: static-pvc
    namespace: default
  capacity:
    storage: 100Mi
  accessModes:
    - ReadWriteMany # N Nodos, N Pods
  persistentVolumeReclaimPolicy: Retain # delete
  hostPath:
    path: /logs/
```


```vim
kubectl apply -f static-pv.yml
```

# 10. Desplegar el volumen persistente
```vim
kubectl get pv
```

Resultado:
> El PV queda en estado ***Available*** y de forma predeterminada le asignamo un ***CLAIM*** = static-pvc
~~~~
NAME        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS        CLAIM
pv-static   100Mi      RWX            Retain           Available     default/static-pvc
~~~~

# 11. Reclamar el espacio con un PVC.

> [Documentación Oficial](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)

# 12. Crear el archivo static-pvc.yml
> [assets/static-pvc.yml](./assets/static-pvc.yml)
>
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: static-pvc
spec:
  storageClassName: ""
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 100Mi
  # es posible definir etiquetas para encontrar el PV
  # selector:
  #   matchLabels:
  #     name: static-pv
```


```vim
kubectl apply -f static-pvc.yml
```
# 13. Listar el PVC y el PV

Comprobar que el espacio del PV ha sido reclamado (Bound)

```vim
kubectl get pvc,pv
```
Resultado:
> Status: ***Bound***, se han "conectado" el PVC y el PV reclamando efectivamente el espacio del disco.

> En caso de aparecer ***Pending*** se debe a que el PVC no ha encontrado un volumen con la capacidad y modo de acceso requeridos.

PVC:
~~~~
NAME         STATUS        VOLUME      CAPACITY   ACCESS MODES   STORAGECLASS   AGE
static-pvc   Bound         static-pv   100Mi      RWX                           4s
~~~~

PV:
> Status: ***Bound***
~~~~
NAME        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS        CLAIM
static-pv   100Mi      RWX            Retain           Bound         default/static-pvc
~~~~

# 14. Crear un Pod que utilice el PVC
> [assets/static-pod-pvc.yml](./assets/static-pod-pvc.yml)

## 14.1. Crear el Archivo: static-pod-pvc.yml
```yaml
kind: Pod
apiVersion: v1
metadata:
  name: static-pod
  labels:
    app: static-pod
spec:
  containers:
    - name: website
      image: nginx
      ports:
        - containerPort: 80
      volumeMounts:
        - name: static-vol
          mountPath: /usr/share/nginx/html/ # destino dentro del Pod
        - name: web-claim
          mountPath: /var/log/nginx
  volumes:
    - name: static-vol
      hostPath:
        path: /home/kube/kubelabs/assets/13
    - name: web-claim
      persistentVolumeClaim:
        claimName: static-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: static-pod-pv-svc
spec:
  type: NodePort
  ports:
    - targetPort: 80
      port: 80
  selector:
    app: static-pod
```
## 14.2. Aplicar el yaml
```vim
kubectl apply -f static-pod-pvc.yml
```

# 15. Listar Pod
```vim
kubectl describe pods static-pod
```
Resultado:
~~~~
Mounts:
	/usr/share/nginx/html/ from static-vol (rw)
	/var/log/nginx from web-claim (rw)
...
Volumes:
  static-vol:
    Type:          HostPath (bare host directory volume)
    Path:          /home/kube/kubelabs/assets/13
  web-claim:
    Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
    ClaimName:  static-pvc
    ReadOnly:   false
~~~~

# 16. Opcional: probar el almacenamiento local /logs
```vim
ssh <server>

tail -f /logs/access.log

# crear tráfico en browser
<ip-publica>:<nodePort>
```

# 17. Limpiar
```k
kubectl delete all --all
```
# 18. Storage Class

# 19. Crear el storage class utilizando el archivo storage-class.yml

> [Documentación Ofcial](https://kubernetes.io/docs/concepts/storage/dynamic-provisioning/)

> [assets/storage-class.yml](./assets/storage-class.yml)

> [Force Delete](https://jhooq.com/k8s-delete-pv-pvc/)

## 19.1. Crear el archivo: storage-class.yaml
```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: democlass
# provisioner: kubernetes.io/no-provisioner
provisioner: microk8s.io/hostpath
volumeBindingMode: WaitForFirstConsumer
reclaimPolicy: Retain

# provisioner: kubernetes.io/gce-pd # para Google GKE
# parameters:
#   type: pd-standard # pd-ssd
#   fstype: ext4
#   replication-type: none
#   zone: us-east4-b
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: auto-pvc
spec:
  storageClassName: democlass
  accessModes:
    - ReadWriteMany # [ReadWriteOnce ReadOnlyMany]
  resources:
    requests:
      storage: 100Mi
```

## 19.2. Aplicar:
 ```vim
 kubectl apply -f storage-class.yml
 ```

 ```vim
 kubectl get sc
 ```

Resultado:
~~~~
NAME                          PROVISIONER            RECLAIMPOLICY   VOLUMEBINDINGMODE    ALLOWVOLUMEEXPANSION   AGE
democlass                     kubernetes.io/gce-pd   Delete          WaitForFirstConsumer false                  3s
~~~~

> Estado: WaitForFirstConsumer

## 19.3. Listar el claim

```vim
kubectl describe pvc auto-pvc
```

```vim
kubectl describe pvc auto-pvc
```
Resultado: Esperando el primer Pod
~~~~
Events:
  Type    Reason                Age                From                         Message
  ----    ------                ----               ----                         -------
  Normal  WaitForFirstConsumer  8s (x8 over 103s)  persistentvolume-controller  waiting for first consumer...
~~~~

# 20. Ejecutar un Pod que consuma el auto-pvckube-labskube-labs

> [assets/storage-class-pod.yml](./assets/storage-class-pod.yml)

## 20.1. Crear el archivo: storage-class-pod.yml
```yaml
kind: Pod
apiVersion: v1
metadata:
  name: storageclass-pod
  labels:
    app: storageclass-pod
spec:
  containers:
    - name: website
      image: nginx
      ports:
        - containerPort: 80
      volumeMounts:
        - name: static-vol
          mountPath: /usr/share/nginx/html/ # destino dentro del Pod
        - name: web-auto-claim
          mountPath: /var/log/nginx
  volumes:
    - name: static-vol
      hostPath:
        path: /home/kube/kubelabs/assets/13
    - name: web-auto-claim
      persistentVolumeClaim:
        claimName: auto-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: storageclass-pod-pv-svc
spec:
  type: NodePort
  ports:
    - targetPort: 80
      port: 80
  selector:
    app: storageclass-pod

```
## 20.2. Aplicar:
```vim
kubectl apply -f storage-class-pod.yml
```

```vim
kg pvc,pv
```
Resultado: Automaticamente nos crea el PV, STATUS: ***BOUND***
~~~~
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                STORAGECLASS   REASON   AGE
pvc-b81ac32c-085d-4d05-ad4f-eee43dae2e9f   100Mi      RWO            Delete           Bound    default/auto-pvc     democlass               8m25s
~~~~


# 21. Revisar eventos del cluster
```vim
kubectl get events --sort-by=.metadata.creationTimestamp

k describe pvc auto-pvc
```
> ProvisioningSucceeded

# 22. Opcional: Validar el storage en el control plane
```vim
ssh <'dominio'>


cd /var/snap/microk8s/common/default-storage

ls

cd <pvc-folder-name>

ls

tail -f access.log
```

# 23. Limpiar
```k
kubectl delete all --all
```
