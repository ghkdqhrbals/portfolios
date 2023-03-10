---
layout: default
title: π μΏ λ²λ€ν°μ€
parent: λμ»€
nav_order: 4
---

# **Kubernetes**

* μΏ λ²λ€ν°μ€λ docker-composeμ λΉμ·ν μ­ν μ μνν©λλ€(μλ²μ μλμ¬μ€ν, μκ²© νΈλ€λ§, etc.). μ°¨μ΄μ μ docker-composeλ single host νκ²½μμ μνλλ©°, μΏ λ²λ€ν°μ€λ multi-host νκ²½μμ μνλ©λλ€.

![a](../../../assets/p/6/kubernetes_detail.png)

## 1. **Components**

* `Cluster` : `Controll Plane`κ³Ό 1κ° μ΄μμ `Worker Node` μ μ§ν©μλλ€.
  * `Controll Plane` : `Master Node` λ‘λ λΆλ¦½λλ€. μ΄ λΈλλ `Worker Node` λ€κ³Ό `Pod` λ€μ κ΄λ¦¬νλ μ­ν μ μνν©λλ€.
    * `API server` : μΏ λ²λ€ν°μ€λ₯Ό RESTAPIλ₯Ό ν΅ν΄ κ΄λ¦¬ν  μ μκ² λ§λ€μ΄μ£Όλ μλ²μλλ€.
    * `Scheduler` : `Worker Node` λ΄λΆ `Pod`λ€μ μ€μΌμ₯΄λ§μ λ΄λΉν©λλ€.
    * `Controll Manager` : μ€μ§μ μΌλ‘ `Worker Node`, `Pod`λ₯Ό κ΄λ¦¬νλ©° νμ¬ μνλ₯Ό μ²΄ν¬ν©λλ€.
    * `etcd`(key-value store) : μ¬λ¬κ°μ§  configuration νμΌλ€μ΄ μ μ₯λμ΄μλ κ³³μλλ€.
  * `Worker Node` : μλΉμ€λ₯Ό μννλ `Pod`κ° μ€νλλ λΈλμλλ€.
    * `kubelet` : `Master Node` μ `Worker Node` μ¬μ΄ λ§€κ°μ²΄μ΄λ©°, νλ λ³ ν¬μ€μ²΄ν¬λ₯Ό μνν©λλ€.
    * `kube-proxy` : IP λ³νκ³Ό λΌμ°νμ λ΄λΉν©λλ€. μ¬κΈ°μ load-balancingμ μ€μ ν  μ μμ΅λλ€.
    * `Container runtime` : `Container Registry`λ‘λΆν° λμ»€ μ΄λ―Έμ§λ₯Ό κ°μ Έμ€κ³ , μ»¨νμ΄λλ₯Ό μμ/μ’λ£ν  μ μμ΅λλ€.
  > `Container Registry` : `Docker Hub`, `Amazon Elastic Container Registry(ECR)`, `Google Container Registry(GCR)`

## 2. **Types of yaml used in Kubernetes**
μ€μ§μ μΌλ‘ μλ²λ€μ `Pod`λΌλ λ¨μλ‘ μλΉμ€λ©λλ€. μ΄λ¬ν Podλ₯Ό λ§λ€κΈ° μν΄μλ λ€μν νμμ configuration νμΌλ€μ΄ νμν©λλ€. μ΄λ¬ν νμΌ νμμ μ£Όλ‘ yamlμ΄λΌλ νμμ μ¬μ©νκ² λλλ°μ. `Deployment`, `Service`, `Ingress`, `ClusterIssuer`, λ±μ νμμ΄ μ‘΄μ¬ν©λλ€. μ΄μ λΆν° κ°κ°μ yamlνμΌλ€μ μμλ³΄κ² μ΅λλ€.

### 2-1. **Deployment**
`Deployment`λ Podμ μ¬μ©λλ λμ»€ μ΄λ―Έμ§λ₯Ό λΆλ¬μμ, λͺκ°μ λμΌν `Pod`λ₯Ό μμ±ν  κ²μΈμ§ μ€μ νλ νμΌμλλ€. μλλ λ±νΉ μλ²μ μ¬μ©ν deployment.yaml νμΌμλλ€.


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

* apiVersion : μΏ λ²λ€ν°μ€κ° μ κ³΅νλ κΈ°λ₯λ€μ λ²μ μλλ€. μ λ§ λ€μν λ²μ μ΄ μ‘΄μ¬νκ³  κ°κ°μ λ²μ μ μ§μνλ λ°κ° μ λΆ λ€λ¦λλ€. λ€μν λ²μ λ€κ³Ό κ°κ°μ λ΄μ©μ [https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-apiversion-definition-guide.html](https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-apiversion-definition-guide.html)μμ νμΈκ°λ₯ν©λλ€.
* kind : νμμλλ€.
* metadata : μ΄ μ€μ μ λΌλ²¨μ λΆμ΄κ³  μ μ₯νλ μ­ν μ μνν©λλ€.
* spec : details of components
  * replicas : `pod`μ κ°μλ₯Ό μ€μ ν©λλ€.
  * selector : λ³΅μ λ³Έμ μμ±ν  ννλ¦Ώ μ΄λ¦μ μ νν©λλ€.
  * template.spec.container : ννλ¦Ώμ μ΄λ€ λμ»€ μ΄λ―Έμ§κ° μ¬μ©λ  κ²μΈμ§, ν¬νΈ λ° κΈ°ν μ€μ μ μνν©λλ€(Dockerμ€μ κ³Ό λμΌν©λλ€).
    1. Docker Hub μμ `ghkdqhrbals/simplebank:latest` μ΄λ―Έμ§λ₯Ό κ°μ Έμ΅λλ€.
    2. `golang-backend-api`λΌλ μ΄λ¦μΌλ‘ μ»¨νμ΄λλ₯Ό μμ±ν©λλ€.
    3. `8080` ν¬νΈλ₯Ό μΈλΆμ λΈμΆμν΅λλ€.

### 2-2.  **Service**
μμ μ°λ¦¬λ deployment.yamlλ₯Ό ν΅ν΄ `Pod`λ₯Ό 2κ° μμ±νμ΅λλ€. `Service` νμμ μ΄ Podλ€μ ν΅ν© entryν¬μΈνΈλ₯Ό μ κ³΅νλ©°, μ΄λ€ λ°©μμΌλ‘ μΈλΆμμ μ μν  μ§ λ€νΈμν¬λ₯Ό μ€μ νλ νμμλλ€. μλλ service.yaml νμΌμλλ€.

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

> reference from [https://matthewpalmer.net/kubernetes-app-developer/articles/service-kubernetes-example-tutorial.html](https://matthewpalmer.net/kubernetes-app-developer/articles/service-kubernetes-example-tutorial.html)

* spec.type : `ClusterIP`, `LoadBalancer`, `NodePort` μ€ νλλ₯Ό μ νν  μ μμ΅λλ€.
  * ClusterIP : μ΄ μ€μ μ μΏ λ²λ€ν°μ€ ν΄λ¬μ€ν° λ΄λΆμμλ§ `Pod`μ μ μν  μ μλλ‘ μ€μ ν΄μ€λλ€.
  * NodePort : ν΄λ¬μ€ν° μΈλΆμμλ `Pod`μ μ μ κ°λ₯νλλ‘ μ€μ ν΄μ€λλ€.
  * LoadBalancer : ν΄λΌμ°λμμ μ κ³΅νλ λ‘λλ°Έλ°μ±μ μ¬μ©νκΈ° μν νμμλλ€.

{: .highlight }
> μ, μ§κΈκΉμ§ deploymentμ serviceλ₯Ό μ μνμ΅λλ€.
> 
> νλ² μ λ¦¬ν΄λ³ΌκΉμ?
> 
> μ°λ¦¬λ **Deployment**λ₯Ό ν΅ν΄ (1) λμ»€μ΄λ―Έμ§λ₯Ό λΆλ¬μμ, (2) λ κ°μ μλΉμ€(Pod)λ₯Ό μμ±νμ΅λλ€. (3) κ·Έλ¦¬κ³  μ΄ μλΉμ€λ€μ κ°κΈ° λ€λ₯Έ IPλ₯Ό κ°μ§κ³  ν¬νΈ 8080λ₯Ό λ΄λΆλΈμΆμν΅λλ€.
> 
> κ·Έλ¦¬κ³  **Service**λ₯Ό ν΅ν΄ (1) μ?κΈ΄ Pod μ§ν©μ λΆλ¬μ€κ³ , (2) ν΅ν© μνΈλ¦¬ ν¬μΈνΈμΈ ν¬νΈ 80λ₯Ό μ κ³΅νκ³ , (3) κ°κ°μ `Pod`:8080μΌλ‘ **λΌμ΄λλ‘λΉ** ν¬νΈν¬μλ©νμμ΅λλ€(κΈ°λ³Έμ μΌλ‘ λΌμ΄λλ‘λΉμΌλ‘ μ€μ λ©λλ€).
> 
> νμ§λ§ μμ§κΉμ§λ, μΈλΆλ‘ ν¬νΈκ° λΈμΆλμ§ μμμ΅λλ€.
> 
> μ΄μ λΆν° μ΄κ±Έ μ€μ νκΈ° μν΄μ μ°λ¦¬λ **Ingress** λ₯Ό μμ±ν΄μ£Όμ΄μΌν©λλ€!


### 2-3. **Ingress**
![a](../../../assets/p/6/ingress.png)

Ingressλ μΈλΆμ ν¬νΈλ₯Ό λΈμΆμμΌμ€κ³Ό λμμ λ‘λλ°Έλ°μ±μ μ€μ ν΄μ£Όλ μ­ν μ μνν©λλ€. μλλ ingress.yaml νμΌμλλ€.

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

μ¬κΈ°μλ μ¬λ¬κ°μ§ μ­ν μ μννκ² λ©λλ€.
1. TLS μΈμ¦μ μ μ©
   * TLS μΈμ¦μλ μμ μ΄ κ°μ§κ³  μλ λλ©μΈμ letsencrypt μ μ°λνλ©° λ¬΄λ£λ‘! λ°κΈλ°μ μ μμ΅λλ€.
   * μ λ λλ©μΈμ AWS-Route-53μ ν΅ν΄ μμ΅λλ€.
2. λλ©μΈ μ°κ²°
   * spec.rules.host : μ¬κΈ°μ μμ μ΄ κ°μ§κ³  μλ λλ©μΈμ μ κ³ , http.path μ μΆκ°μ μΈ λΌμ°νμ μ μΌμλ©΄ λ©λλ€.
3. μΈλΆ ν¬νΈ λΈμΆ
   * backend.service.name : μμ μ°λ¦¬κ° μ€μ νλ serviceλ λ¬ΆκΈ΄ Podλ€μ κ°μ§κ³  μμ΅λλ€. μ¬κΈ°μ μΈλΆ ν¬νΈλ₯Ό λ§€νμμΌμ£Όλ μ­ν μ μνν©λλ€(μ΄ λΆλΆμ nginxμ locationμ μ μνλ λΆλΆκ³Ό κ°μ£ ).
 
    
μ΄ μ κ°μ΄ μ°λ¦¬λ μΏ λ²λ€ν°μ€λ₯Ό μ±κ³΅μ μΌλ‘ μ€νν  μ μκ² λ©λλ€!

# References
* [https://www.upguard.com/blog/docker-vs-vmware-how-do-they-stack-up](https://www.upguard.com/blog/docker-vs-vmware-how-do-they-stack-up)
* [https://stackoverflow.com/questions/47536536/whats-the-difference-between-docker-compose-and-kubernetes](https://stackoverflow.com/questions/47536536/whats-the-difference-between-docker-compose-and-kubernetes)
* [https://github.com/compose-spec/compose-spec/blob/master/spec.md](https://github.com/compose-spec/compose-spec/blob/master/spec.md)
* [https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/What-is-Kubernetes-vs-Docker-Compose-How-these-DevOps-tools-compare](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/What-is-Kubernetes-vs-Docker-Compose-How-these-DevOps-tools-compare)
* [**https://medium.com/devops-mojo/kubernetes-architecture-overview-introduction-to-k8s-architecture-and-understanding-k8s-cluster-components-90e11eb34ccd**](https://medium.com/devops-mojo/kubernetes-architecture-overview-introduction-to-k8s-architecture-and-understanding-k8s-cluster-components-90e11eb34ccd)
* [https://matthewpalmer.net/kubernetes-app-developer/articles/service-kubernetes-example-tutorial.html](https://matthewpalmer.net/kubernetes-app-developer/articles/service-kubernetes-example-tutorial.html)
* [https://kubernetes.io/docs/concepts/services-networking/ingress/](https://kubernetes.io/docs/concepts/services-networking/ingress/)
