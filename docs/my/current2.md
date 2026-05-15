---
layout: default
title: 2023-06-01<br/>개발자 취준생 일기
parent: 개발자 일기
nav_order: 2
---
# 새로운 기술 갈망 그리고 한계

요즘 새로운 기술을 적용하고싶다는 생각을 합니다. 특히 No-sql 쪽으로요. 이유는 MSA 프로젝트를 진행하면서 RDBMS(Postgresql)가 가지는 명확한 문제점을 발견했거든요. 그 문제점은 RDB는 자연스러운 수평 확장이 불가능하다는 점이였습니다. **동일 서비스가 두 대로 늘어나도 결국 하나의 RDB를 사용할 수 밖에 없거든요**. 물론! 날짜 별 DB를 새로 만들어서 연결해주면 수평확장이 어느정도 가능하긴합니다만 임시방편일 뿐이라고 생각합니다. 그래서 Cassandra나 Redis 를 사용하고 싶습니다. 클러스터를 통해 수평확장 하기 편할 뿐 더러, Cassandra나 Redis는 SPOF(Single Point Of Failure)이 없기 때문이죠.

하지만 현실적인 한계가 있습니다. 첫 째 이유는 알고리즘 풀이, CS 공부, 개발, 면접 준비, 기존 개발 정리 이 5 가지를 진행하려고 하니 시간적 여유가 없습니다. 두 번 째로 컴퓨터가 버티질 못합니다. 물론 AWS 를 사용하면 가능하지만 그렇게되면 비용문제가 또 발생합니다. 안그래도 AWS의 Route-53, ECR, EKS, RDS, EC2, Secrets 를 사용하는데 드는 돈이 매 월 20만원이 넘어가거든요. 이 이상의 지출은 취준생에게 치명적입니다.

따라서 새로운 기술을 적용해보고 싶지만 시간부족/비용부족으로 쉽지 않은 것 같습니다. 뭐 비용은 어떻게든 처리할 수 있지만 특히 시간은 절대적인 부분이라 여유를 내기 어렵거든요.

그래서 혼자만의 고민을 여기에 기록해봅니다. 언젠가 시간이 여유로워진다면 꼭 프로젝트에 적용해볼거에요!


<html>
    <script src="https://utteranc.es/client.js"
            repo="ghkdqhrbals/portfolios"
            issue-term="pathname"
            theme="github-light"
            crossorigin="anonymous"
            async>
    </script>
</html>