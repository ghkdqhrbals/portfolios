---
layout: default
title: 📌 쿠버네티스의 아키텍처 설명
parent: 도커와 쿠버네티스
date: 2021-02-19
nav_order: 4
---

# **Kubernetes**

* 쿠버네티스는 docker-compose와 비슷한 역할을 수행합니다(서버의 자동재실행, 원격 핸들링, etc.). 차이점은 docker-compose는 single host 환경에서 수행되며, 쿠버네티스는 multi-host 환경에서 수행됩니다.

![a](../../../assets/p/6/kubernetes_detail.png)

## **Components**

* `Cluster` : `Controll Plane`과 1개 이상의 `Worker Node` 의 집합입니다.
  * `Controll Plane` : `Master Node` 로도 불립니다. 이 노드는 `Worker Node` 들과 `Pod` 들을 관리하는 역할을 수행합니다.
    * `API server` : 쿠버네티스를 RESTAPI를 통해 관리할 수 있게 만들어주는 서버입니다.
    * `Scheduler` : `Worker Node` 내부 `Pod`들의 스케쥴링을 담당합니다.
    * `Controll Manager` : 실질적으로 `Worker Node`, `Pod`를 관리하며 현재 상태를 체크합니다.
    * `etcd`(key-value store) : 여러가지  configuration 파일들이 저장되어있는 곳입니다.
  * `Worker Node` : 서비스를 수행하는 `Pod`가 실행되는 노드입니다.
    * `kubelet` : `Master Node` 와 `Worker Node` 사이 매개체이며, 파드 별 헬스체크를 수행합니다.
    * `kube-proxy` : IP 변환과 라우팅을 담당합니다. 여기서 load-balancing을 설정할 수 있습니다.
    * `Container runtime` : `Container Registry`로부터 도커 이미지를 가져오고, 컨테이너를 시작/종료할 수 있습니다.
  > `Container Registry` : `Docker Hub`, `Amazon Elastic Container Registry(ECR)`, `Google Container Registry(GCR)`

## **Types of yaml used in Kubernetes**
실질적으로 서버들은 `Pod`라는 단위로 서비스됩니다. 이러한 Pod를 만들기 위해서는 다양한 타입의 configuration 파일들이 필요합니다. 이러한 파일 형식은 주로 yaml이라는 형식을 사용하게 되는데요. `Deployment`, `Service`, `Ingress`, `ClusterIssuer`, 등의 타입이 존재합니다. 이제부터 각각의 yaml파일들을 알아보겠습니다.

### 2-1. **Deployment**
`Deployment`는 Pod에 사용되는 도커 이미지를 불러와서, 몇개의 동일한 `Pod`를 생성할 것인지 설정하는 파일입니다. 아래는 뱅킹 서버에 사용한 deployment.yaml 파일입니다.


```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: golang-backend-api-deployment
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

* apiVersion : 쿠버네티스가 제공하는 기능들의 버전입니다. 정말 다양한 버전이 존재하고 각각의 버전은 지원하는 바가 전부 다릅니다. 다양한 버전들과 각각의 내용은 [https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-apiversion-definition-guide.html](https://matthewpalmer.net/kubernetes-app-developer/articles/kubernetes-apiversion-definition-guide.html)에서 확인가능합니다.
* kind : 타입입니다. 주로 우리는 Service, PersistanceVolume, PersistanceVolumeClaim, Deployment, Ingress 등을 사용할 수 있습니다.
* metadata : 여러 메타데이터들을 입력할 수 있습니다. 라벨을 붙이고 저장하는 역할을 수행합니다.

<details><summary> metadata 필드에 입력할 수 있는 주요 속성들 </summary><div markdown="1">

1. **name (필수):**

- 리소스의 이름을 지정합니다. 이름은 리소스의 고유 식별자이어야 합니다.
- 예: `name: my-pod`

2. **namespace:**

- 리소스가 속하는 네임스페이스(namespace)를 지정합니다. 네임스페이스를 지정하지 않으면 기본 네임스페이스인 "default"가 사용됩니다.
- 예: `namespace: my-namespace`

3. **labels:**

- 리소스에 부여할 라벨(Label)을 지정합니다. 라벨은 리소스를 식별하는 데 사용됩니다.
- 예:
  ```yaml
  labels:
    app: my-app
    environment: production
  ```

4. **annotations:**

- 리소스에 추가 정보를 제공하는 어노테이션(Annotation)을 지정합니다. 어노테이션은 라벨과 유사하지만 더 자세한 메타데이터를 저장하는 데 사용됩니다.
- 예:
  ```yaml
  annotations:
    description: This is my application.
    owner: John Doe
  ```

5. **resourceVersion:**

- 리소스의 버전 정보를 나타내는 값입니다. 주로 클러스터 내에서 리소스의 변경을 추적하는 데 사용됩니다.

6. **generateName:**

- 이름을 자동으로 생성할 때 사용하는 접두사(prefix)입니다. 주로 리소스를 동적으로 생성할 때 사용됩니다.

7. **finalizers:**

- 리소스가 삭제될 때 실행되어야 하는 종료 처리(finalization) 핸들러를 지정합니다.

8. **clusterName:**

- 리소스가 속한 클러스터의 이름을 지정합니다.

9. **selfLink:**

- 리소스의 자체 링크를 지정합니다.

10. **uid:**

- 리소스의 고유 식별자인 UID를 지정합니다.

11. **ownerReferences:**

- 다른 리소스가 해당 리소스를 소유하는 경우 연관된 리소스 정보를 지정합니다.

12. **creationTimestamp:**

- 리소스가 생성된 시간을 나타내는 타임스탬프를 포함합니다.

13. **deletionTimestamp:**

- 리소스가 삭제될 예정인 경우, 삭제 예정인 시간을 나타내는 타임스탬프를 포함합니다.

14. **deletionGracePeriodSeconds:**

- 리소스가 삭제될 때 Graceful Delete를 위한 대기 시간을 지정합니다.

15. **initializers:**

- 초기화를 제어하기 위한 설정 정보를 포함합니다.

16. **managedFields:**

- 리소스의 관리 필드 정보를 포함합니다.

17. **ownerReference:**

- 다른 리소스가 해당 리소스를 소유하는 경우에 대한 연결 정보를 포함합니다.

위에서 설명한 메타데이터 속성 중 일부는 필수이며, 다른 일부는 선택 사항입니다. 리소스의 유형 및 사용 사례에 따라 어떤 메타데이터를 설정할지를 결정해야 합니다.

</div></details>

* spec : 실제로 리소스를 생성할 때 필요한 정보들을 입력합니다.
  * replicas : `pod`의 개수를 설정합니다.
  * selector : 복제본을 생성할 템플릿 이름을 선택합니다. Service의 metadata.label 과 동일한 값을 가져야합니다. **만일 Service 의 `metadata.label.{key:value}` 가 app: golang-backend-api 라면, 여기서도 app: golang-backend-api 를 가져야합니다.**
  * template.metadata : 이 deployment 로 인해 복제되는 여러 파드들에게 공통으로 적용할 메타데이터를 입력할 수 있습니다.
  * template.spec : 각 템플릿에 어떤 도커 이미지가 사용될 것인지, 포트 및 기타 설정을 수행합니다(Docker설정과 동일합니다). 
    1. Docker Hub 에서 `ghkdqhrbals/simplebank:latest` 이미지를 가져옵니다.
    2. `golang-backend-api`라는 이름으로 컨테이너를 생성합니다.
    3. `8080` 포트를 네트워크 내부에 노출시킵니다.

### 2-2.  **Service**
앞서 우리는 deployment.yaml를 통해 `Pod`를 2개 생성했습니다. `Service` 타입은 이 Pod들에 통합 entry포인트를 제공하며, 어떤 방식으로 외부에서 접속할 지 네트워크를 설정하는 타입입니다. 아래는 service.yaml 파일입니다.

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

* spec.type : `ClusterIP`, `LoadBalancer`, `NodePort` 중 하나를 선택할 수 있습니다.
  * ClusterIP : 이 설정은 쿠버네티스 클러스터 내부에서만 `Pod`에 접속할 수 있도록 설정해줍니다.
  * NodePort : 클러스터 외부에서도 `Pod`에 접속 가능하도록 설정해줍니다. 만약 2개의 파드와 연결된 서비스가 NodePort 로 되어있다면, 라운드로빈 방식으로 순서대로 요청이 각 파드에 전달됩니다.
  * LoadBalancer : 클라우드에서 제공하는 로드밸런싱을 사용하기 위한 타입입니다.

{: .highlight }
> 자, 지금까지 deployment와 service를 정의했습니다.
> 
> 한번 정리해볼까요?
> 
> 우리는 **Deployment**를 통해 (1) 도커이미지를 불러와서, (2) 두 개의 서비스(Pod)를 생성했습니다. (3) 그리고 이 서비스들은 각기 다른 IP를 가지고 포트 8080를 내부노출시킵니다.
> 
> 그리고 **Service**를 통해 (1) 엮긴 Pod 집합을 불러오고, (2) 통합 엔트리 포인트인 포트 80를 제공하고, (3) 각각의 `Pod`:8080으로 **라운드로빈** 포트포워딩하였습니다(기본적으로 라운드로빈으로 설정됩니다).
> 
> 하지만 아직까지는, 외부로 포트가 노출되지 않았습니다.
> 
> 이제부터 이걸 설정하기 위해서 우리는 **Ingress** 를 작성해주어야합니다!(물론 NodePort 로 직접외부노출할 수 있습니다.)


### 2-3. **Ingress**
![a](../../../assets/p/6/ingress.png)

**Ingress는 외부에 포트를 노출시켜줌과 동시에 로드밸런싱을 설정해주는 역할을 수행합니다.** 아래는 ingress.yaml 파일입니다.

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

여기서는 여러가지 역할을 수행하게 됩니다.
1. TLS 인증서 적용
   * TLS 인증서는 자신이 가지고 있는 도메인을 letsencrypt 와 연동하며 무료로! 발급받을 수 있습니다.
   * 저는 도메인을 AWS-Route-53을 통해 샀습니다.
2. 도메인 연결
   * spec.rules.host : 여기에 자신이 가지고 있는 도메인을 적고, http.path 에 추가적인 라우팅을 적으시면 됩니다.
3. 외부 포트 노출
   * backend.service.name : 앞서 우리가 설정했던 service는 묶긴 Pod들을 가지고 있습니다. 여기에 외부 포트를 매핑시켜주는 역할을 수행합니다(이 부분은 nginx의 location을 정의하는 부분과 같죠).
 
    
이 와 같이 우리는 쿠버네티스를 성공적으로 실행할 수 있게 됩니다!

# References
* [https://www.upguard.com/blog/docker-vs-vmware-how-do-they-stack-up](https://www.upguard.com/blog/docker-vs-vmware-how-do-they-stack-up)
* [https://stackoverflow.com/questions/47536536/whats-the-difference-between-docker-compose-and-kubernetes](https://stackoverflow.com/questions/47536536/whats-the-difference-between-docker-compose-and-kubernetes)
* [https://github.com/compose-spec/compose-spec/blob/master/spec.md](https://github.com/compose-spec/compose-spec/blob/master/spec.md)
* [https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/What-is-Kubernetes-vs-Docker-Compose-How-these-DevOps-tools-compare](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/What-is-Kubernetes-vs-Docker-Compose-How-these-DevOps-tools-compare)
* [**https://medium.com/devops-mojo/kubernetes-architecture-overview-introduction-to-k8s-architecture-and-understanding-k8s-cluster-components-90e11eb34ccd**](https://medium.com/devops-mojo/kubernetes-architecture-overview-introduction-to-k8s-architecture-and-understanding-k8s-cluster-components-90e11eb34ccd)
* [https://matthewpalmer.net/kubernetes-app-developer/articles/service-kubernetes-example-tutorial.html](https://matthewpalmer.net/kubernetes-app-developer/articles/service-kubernetes-example-tutorial.html)
* [https://kubernetes.io/docs/concepts/services-networking/ingress/](https://kubernetes.io/docs/concepts/services-networking/ingress/)
