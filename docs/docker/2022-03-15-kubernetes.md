---
layout: default
title: Kubernetes
parent: 도커
nav_order: 3
---

# **Kubernetes**
* Kubernetes is a platform for managing containerized workloads and services, that facilitates both declarative configuration and automation
> if you run your service in single host, you don't need to use kubernetes. But if you want to run your service in **multiple-host** and take leverage in automation, **you can use Kubernetes for your convenience**.

<!-- ![a](../../assets/p/6/k8s.png) -->
![a](../../../assets/p/6/kubernetes_detail.png)

Now, I will explain each components.

## **Components**

* `Cluster` : is a set of `Controll Plane` and one or more `Worker Node`.
  * `Controll Plane` : also called `Master Node`. And it manages the `Worker Node`s and the `Pod`s in the cluster.
  * `API server` : entry point for REST/kubectl
  * `Scheduler` : schedules pods to worker nodes
  * `Controll Manager` : it manages and watches their current state of `Worker Node`, `Pod`
  * `etcd`(key-value store) : stores all of Kubernetes cluster data(cluster state and config)
  * `Worker Node` : maintain running `Pod` and provide the Kubernetes runtime environment
  * `kubelet` : It makes sure that containers are running in a Pod and they are healthy.
  Path between API server of `Controll Plane`
  * `kube-proxy` : manages IP translation and routing. It facilitating Kubernetes networking services and load-balancing across all pods in a service
  * `Container runtime` : It pulls images from `Container Registry` and starts and stops containers
  > `Container Registry` : can be `Docker Hub`, `Amazon Elastic Container Registry(ECR)`, `Google Container Registry(GCR)`

## **Types of yaml used in Kubernetes**
To run kubernetes, we need to set configuration files with yaml format. There are various type like `Deployment`, `Service`, `Ingress`, `ClusterIssuer`, etc.


### **Deployment**
A `deployment` type is responsible for keeping a set of pods running. Here is an example of deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: golang-backend-api-deployment
  labels:
    app: golang-backend-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: golang-backend-api
  template:
    metadata:
      labels:
        app: golang-backend-api
    spec:
      containers:
      - name: golang-backend-api
        image: ghkdqhrbals/simplebank:latest
        imagePullPolicy: Always
        ports:
          - containerPort: 8080
        env:
          - name: DB_SOURCE
            value: postgresql://root:secret@postgres:5432/simple_bank?sslmode=disable
```
{: file='deployment.yaml'}

* apiVersion : set api version. Here is a organized API information[https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-apiversion-definition-guide.html](https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-apiversion-definition-guide.html)
* kind : this is a type of configuration
* metadata : store resource label, name
* spec : details of components
  * replicas : set the number of `pod`
  * selector : what will deployment want to replicate(**find in `template`**)
  * template.spec.container :
    (1) find `ghkdqhrbals/simplebank:latest` Docker images from **Docker Hub**,
    (2) run container with name `golang-backend-api`,
    (3) set container port `8080`

### **Service**
:A `service` is responsible for **enabling network access to a set of pods**.
> when you use only service, **need to create pods passively**


```yaml
apiVersion: v1
kind: Service
metadata:
  name: golang-backend-api-service
spec:
  type: ClusterIP #diff. LoadBalancer, etc.
  selector:
    app: golang-backend-api
  ports:
    - protocol: TCP
      # nodePort is external access port outside the cluster. But, as we set type as clusterIP, this setting isn't needed
      # nodePort: 30131
      port: 80 # internal port
      targetPort: 8080 # forward port
```
{: file='service.yaml'}

> reference from [https://matthewpalmer.net/kubernetes-app-developer/articles/service-kubernetes-example-tutorial.html](https://matthewpalmer.net/kubernetes-app-developer/articles/service-kubernetes-example-tutorial.html)

* spec.type : you may choose within `ClusterIP` or `LoadBalancer` or `NodePort`
  * ClusterIP : The service is only accessible from within the Kubernetes cluster
  > you can't make requests to your `Pod` from outside the cluster
  * NodePort : The service can handle requests that originate from outside the cluster
  * LoadBalancer : The service becomes accessible externally through a cloud provider's load balancer functionality

In this case, (1) service get request from port:80 internally, (2) select pods with labeled `golang-backend-api`, (3) forward request to container port `8080` in golang-backend-api pod.


### **Ingress**
Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster. Traffic routing is controlled by rules defined on the Ingress resource.

![a](../../../assets/p/6/ingress.png)


```yaml
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: nginx
spec:
  controller: k8s.io/ingress-nginx
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: golang-backend-api-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt
spec:
  ingressClassName: nginx
  rules:
  - host: "api.hwangbogyumin.com"
    http:
      paths:
      - pathType: Prefix # 443, 80 etc. -> 80 if "/" prefix
        path: "/"
        backend:
          service:
            name: golang-backend-api-service
            port:
              number: 80
  tls:
  - hosts:
    - api.hwangbogyumin.com
    secretName: hwangbogyumin-api.cert
```
{: file='ingress.yaml'}






# References
* [https://www.upguard.com/blog/docker-vs-vmware-how-do-they-stack-up](https://www.upguard.com/blog/docker-vs-vmware-how-do-they-stack-up)
* [https://stackoverflow.com/questions/47536536/whats-the-difference-between-docker-compose-and-kubernetes](https://stackoverflow.com/questions/47536536/whats-the-difference-between-docker-compose-and-kubernetes)
* [https://github.com/compose-spec/compose-spec/blob/master/spec.md](https://github.com/compose-spec/compose-spec/blob/master/spec.md)
* [https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/What-is-Kubernetes-vs-Docker-Compose-How-these-DevOps-tools-compare](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/What-is-Kubernetes-vs-Docker-Compose-How-these-DevOps-tools-compare)
* [**https://medium.com/devops-mojo/kubernetes-architecture-overview-introduction-to-k8s-architecture-and-understanding-k8s-cluster-components-90e11eb34ccd**](https://medium.com/devops-mojo/kubernetes-architecture-overview-introduction-to-k8s-architecture-and-understanding-k8s-cluster-components-90e11eb34ccd)
* [https://matthewpalmer.net/kubernetes-app-developer/articles/service-kubernetes-example-tutorial.html](https://matthewpalmer.net/kubernetes-app-developer/articles/service-kubernetes-example-tutorial.html)
* [https://kubernetes.io/docs/concepts/services-networking/ingress/](https://kubernetes.io/docs/concepts/services-networking/ingress/)
