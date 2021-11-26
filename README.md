# KUBELABS <!-- omit in TOC -->
*Carlos Chacón Calvo. Actualización: Diciembre 2021.*

Este proyecto contiene la guía de laboratorio para el desarrollo del curso KubeLabs. <!-- omit in TOC -->

~~~~
Tabla de contenido:


- [1. Instalación de ambiente de **PRUEBAS**: Microk8s](#1-instalación-de-ambiente-de-pruebas-microk8s)
	- [1.1. ¿Porqué Microk8s?](#11-porqué-microk8s)
- [2. Pasos de Instalación](#2-pasos-de-instalación)
	- [2.1. Requisitos Mínimos del host](#21-requisitos-mínimos-del-host)
	- [2.2. Preparación](#22-preparación)
		- [2.2.1. (opcional) Acceso al servidor](#221-opcional-acceso-al-servidor)
	- [2.3. Instalación](#23-instalación)
	- [2.4. Post-Instalación](#24-post-instalación)
	- [2.5. Opcional: Instalar el dashboard](#25-opcional-instalar-el-dashboard)
- [3. Conectar con cluster remoto](#3-conectar-con-cluster-remoto)
	- [3.1. Preparación](#31-preparación)
	- [3.2. Conectar desde Kubectl local ***(Mejor Práctica)***](#32-conectar-desde-kubectl-local-mejor-práctica)
		- [3.2.1. Agrega el cluster con ip publica a kubectl](#321-agrega-el-cluster-con-ip-publica-a-kubectl)
		- [3.2.2. Crear archivo local y pegar la salida de la configuración anterior.](#322-crear-archivo-local-y-pegar-la-salida-de-la-configuración-anterior)
		- [3.2.3. En la extensión Kubernetes:](#323-en-la-extensión-kubernetes)
		- [3.2.4. Para comprobar, sobre el cluster de Microk8s, dar botón derecho y show cluster info.](#324-para-comprobar-sobre-el-cluster-de-microk8s-dar-botón-derecho-y-show-cluster-info)
		- [3.2.5. Opcional, enc caso de cambiar de contexto:](#325-opcional-enc-caso-de-cambiar-de-contexto)
~~~~

----------

## 1. Instalación de ambiente de **PRUEBAS**: Microk8s

### 1.1. ¿Porqué Microk8s?

- Tiene addons, fácil de instalar
- Corre en arquitecturas arm
- Es posible correr en HA, multi nodo
- Fácil de instalar y es liviano
- Para ambientes de desarrollo, QA y Producción de baja carga (bajo cierto riesgo!)
## 2. Pasos de Instalación

> [Documentación Oficial]([https://link](https://microk8s.io/docs))

### 2.1. Requisitos Mínimos del host
~~~~
4GB ram

2 vCores

20 GB almacenamiento

SO Linux
~~~~

### 2.2. Preparación

#### 2.2.1. (opcional) Acceso al servidor
> Las llaves SSH debe ser provistas por el Tutor del curso.
>
- Instalar [vsCode](https://code.visualstudio.com/download)
- En vsCode instalar la Extensión [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)
- Configurar las SSH-KEYS con los permisos mínimos:
	- Linux: chmod 400 $USER
	- Windows: configurar accesos de solo lectura al usuario.
- En la configuración de la extensión Remote - SSH, configurar la conexión con el siguiente formato:

```
Host <ip-publica>
  HostName <ip-publica>
  User dockerlab
  IdentityFile <PATH de la llave SSH privada>
```
- Conectar al Host desde vsCode o Terminal usando SSH:
  ```bash
	ssh kubelabs@<ip-publica-host> -i <PATH de la llave SSH privada>
	```
- En el Host, instalar los prerequisitos:
```bash
sudo apt update

sudo iptables -P FORWARD ACCEPT

sudo apt install snapd
```
### 2.3. Instalación

``` bash
sudo snap install microk8s --classic --channel=1.22/stable

sudo microk8s status --wait-ready
```
### 2.4. Post-Instalación
[Ver archivo de configuración](https://github.com/cachac/kubelabs/blob/main/labs/conf/post-install.sh)

Este archivo .sh configura:

- Kubectl

- Addons

- Kubectl alias (opcional)

- Comprobar instalación

- Kubectl get all –all-namespaces

- Opcional: Bash completion


### 2.5. Opcional: Instalar el dashboard

**NOTA: Debe estar instalado en el punto anterior el addon dashboard (microk8s enable dashboard)**

```bash
microk8s.dashboard-proxy
```
Abrir el dashboardoar en: <ip-publica:10443>

Copiar y pegar el token generado en el browser, preferiblemente Firefox!

## 3. Conectar con cluster remoto
### 3.1. Preparación
- En vs Code agregar las siguientes Extensiones:
  - [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
  - [Kubernetes (Microsoft)](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)

### 3.2. Conectar desde Kubectl local ***(Mejor Práctica)***
#### 3.2.1. Agrega el cluster con ip publica a kubectl
```bash
microk8s kubectl config set-cluster microk8s-cluster \
--server=https://public_IP:16443 --insecure-skip-tls-verify

# Validar las credenciales actuales y copiar la salida
microk8s config
```

#### 3.2.2. Crear archivo local y pegar la salida de la configuración anterior.
Comandos en linux:
```bash
# crear carpeta en HOME
mkdir ~/.kube
# crear archivo de configuración de kubectl local
touch ~/.kube/config
```

#### 3.2.3. En la extensión Kubernetes:
- Seleccionar Clusters – set kubeconfig
- Seleccionar Add new Kubeconfig
- Buscar el archivo **~/.kube/config** creado en el paso anterior.
- Aceptar e Instalar las extensiones y software recomendado por vsCode.

Una vez conectado, se deben mostrar las configuraciones del servidor de Kubernetes: Namespaces, Nodes, Workloads, etc.

#### 3.2.4. Para comprobar, sobre el cluster de Microk8s, dar botón derecho y show cluster info.

#### 3.2.5. Opcional, enc caso de cambiar de contexto:
```bash
# crea el contexto microk8s
kubectl config set-context microk8s --user=admin --cluster=microk8s-cluster
# cambia al nuevo contexto
kubectl config use-context microk8s
```



