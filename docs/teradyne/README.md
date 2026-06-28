# Plan del Curso: Kubernetes & CI/CD

Este documento detalla las dos rutas de aprendizaje (Tracks) basadas en el mapa conceptual del curso.

---

## 🚀 Track 1: Kubernetes
Este track se enfoca en la administración, escalado y conectividad de aplicaciones dentro del clúster de Kubernetes.

Duración estimada: 3 lecciones (4 horas cada una)

* **Despliegue de Pods y ReplicaSets (`deploy pods rs`)**
  * Conceptos fundamentales de Pods, ReplicaSets y estrategias de despliegue.
* **Autoscaling Horizontal de Pods Avanzado (`hpa advanced`)**
  * Configuración avanzada del Horizontal Pod Autoscaler (HPA) usando métricas personalizadas y optimización de recursos.
* **Ingress & Gateway API (`ingress gw api`)**
  * Control del tráfico de entrada al clúster, balanceo de carga y transición hacia el nuevo estándar Gateway API.
* **AIOps (`AI ops`)**
  * Operaciones y automatización asistidas por Inteligencia Artificial para la configuración del workload.

---

## 🛠️ Track 2: CI/CD
Este track se enfoca en la automatización del ciclo de vida del software, desde la integración hasta el despliegue continuo (GitOps).

Duración estimada: 5 lecciones (4 horas cada una)

* **GitHub Actions**
  * Automatización del flujo de integración mediante Pull Requests (PR) y diseño de workflows reutilizables.
* **Kustomize (`KUSTUMIZE`)**
  * Personalización declarativa de manifiestos de Kubernetes por entorno (Desarrollo, QA, Producción) sin plantillas complejas.
* **GitOps con Argo CD**
  * Sincronización continua del estado deseado del clúster con el repositorio de Git utilizando herramientas líderes de GitOps.
* **Despliegue a Producción (`MAIN`)**
  * Flujo final de entrega continua al fusionar cambios en la rama principal (`main`).
