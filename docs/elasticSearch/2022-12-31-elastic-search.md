---
layout: default
title: Elastic Search의 개념 및 RDB와의 차이점
parent: Elastic Search
date: 2022-12-31
nav_order: 1
---

# INDEX
1. 개념
2. RDB와의 차이점
3. Type을 독립적으로 가지지 않은 이유
4. 부모자식관계를 설정하는 두 가지 방법
5. RDB와의 차이점(추가)
6. 문법(Appendix)

## 1. 개념
ES(ElasticSearch)는 Java 오픈소스 분산 검색 엔진이다. ES는 역색인을 지원하기에 기존 RDB가 지원하지 않는 비정형 데이터를 **인덱싱 + 검색하는 것에 특화**되어있다.

> * 비정형 데이터 : Boolean같이 true/false로 정형화 된 데이터가 아닌 규칙이 없는 데이터. ex) **음성**, **텍스트**, **영상**
> * 역색인 : 키워드를 통해 데이터를 찾는 방식

간단하게 정리해보면,

* Elastic Search 장점
  * 특정 필드에 토크나이저를 적용할 수 있음. 이 후, 그 필드에 저장되는 값들은 역색인 인덱스에 토큰화 되서 저장. 이런 역색인 인덱스를 통해 **빠른 토큰 단위 검색 가능**.
* Elastic Search 단점
  * 잦은 삭제/삽입 시, RDB 보다 소요되는 시간 증가(역색인 인덱스를 만드는 과정때문).





## 2. RDB와의 차이점

> 예시
>
> `내 이름은 홍길동 이야`를 ES와 RDB에 저장한다고 가정하자. 그리고 여기서 `홍길동` 이 포함된 여부를 조사하고 싶다.
>
> RDB의 경우 **모든 row를 읽어서** 스페이스를 딜리미터로 파싱한 뒤, 홍길동 포함여부를 조사해야한다. 따라서 모든 row를 읽어야만 하기에 상당한 검색시간이 소요된다.
>
> 반면 ES는 저장할 때부터 `내`, `이름은`, `홍길동`, `이야` 로 토큰화하여 역색인 인덱스에 (id, 단어, doc_id) 형태로 저장한다. 따라서 **특정 row만 읽고 검색이 가능**하다. 단어를 포함하는 doc_id 를 쉽게 알 수 있으며 **빠른 검색이 가능**하다.

먼저 ES의 Notation을 알고 문법을 정리하고자 한다. 표기법은 다음과 같이 RDB와 비슷하게 매칭된다.

| **엘라스틱서치**	                          | 관계형 데이터베이스 |
|--------------------------------------|------------|
| Index	                               | DB         |
| Type(completely removed after v8.0 ) | 	Table     |
| Document                             | Row        |
| Field                                | Column     |
| Mapping                              | Schema     |

**하지만, ES는 RDB와 엄연히 다르다!** 위의 개념은 이해를 돕기위해 가져온 것이지 그 개념이 일치하지 않는다.

> 특히 ES의 Type과 RDB의 Table은 **전혀 다른 개념을 띄고있다**.
>
> 여러 블로그를 찾아봤었는데, 이에 대해 대부분 명시하지 않더라. 부디 필자처럼 삽질하지 않길 바란다.


* In RDB : **테이블이 서로 독립**이며, 같은 Column명을 가진다고해도 서로 영향을 주지 않는다.
* In ElasticSearch : **Type은 서로 독립이 아니다(Index는 독립적임)**. 같은 Index 내 + 다른 Type + 같은 Field명을 가진다면 동일한 Lucene Engine 필드로 처리되기에 서로 영향을 받는다.

> 예로 만약 내가 User(Type)에서 user_name(Field)을 삭제한다고 하였을 때, Account(Type)의 user_name(Field)도 같이 삭제된다는 것이다.

따라서 ES의 Type은 RDB의 Table과 같지않다.

보통 ES에서의 **Type은 RDB에서의 PK/FK 즉, 부모자식관계를 만들때 사용**되었었다. 아래의 예시를 보자

```
curl -XGET "my_index/question,answer/_search" -H 'Content-Type:application/json' -d
`{
  "query": {
    "match": {
      "qid": "100"
    }
  }
}`
```

위의 예시는 `my_index`의 `question`과 `answer` type에서 문제번호 100번을 가져온다. question의 qid는 PK, answer의 qid는 FK처럼 사용됨으로써 부모자식관계처럼 만든 것이다. ES의 Type은 주로 이런식으로 사용하곤 했는데, 사실 RDB의 PK/FK 플로우를 완벽하게 따라갈 수가 없다. 만약 qid(Field)가 삭제될때는 답이없어지기 때문이다.

보통 JPA에서 RDB를 다룰 때, PK가 삭제되면 FK가 자동으로 cascade되도록 설정할 수 있다. 또한 **RDB에서 PK 칼럼을 삭제하는것이 불가능**하다. 하지만, **ES에서는 PK역할을 하는 필드가 삭제가능**하며, 이 때 FK로 쓰던 answer의 해당 필드의 document들은 그냥 평생 남아있게 되어버린다. 결론은, **RDB의 플로우를 따라가기 위해 ES는 Type을 만들었지만, 사실상 따라갈 수 없다**.

이러한 이유로 ES는 Type을 삭제하기로 결심한다!

그럼 애초에 `ES가 Type을 독립시키도록 만들면 더 좋았지 않을까요?` 라는 질문이 떠오를것이다. 이에 대한 답을 레퍼런스에서 해준다.

> On top of that, storing different entities that have few or no fields in common in the same index leads to sparse data and **interferes** with Lucene’s ability to **compress documents efficiently**.
>
> For these reasons, we have decided to remove the concept of mapping types from Elasticsearch.
>
> reference [Why are Mapping Types being removed?](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/removal-of-types.html#_why_are_mapping_types_being_removed)

## 3. Type을 독립적으로 가지도록 설정하지 않은 이유

만약 동일한 인덱스 내부에서 Type별 독립 Field를 가지게 된다면, **비슷한 기능을 하는 Field가 분리되며 데이터가 분산되고 도큐먼트를 효율적으로 압축하는 Lucene의 기능을 방해할것**이라고 한다.

## 4. 그럼 어떻게 ES에서 부모자식관계를 설정해야할까?
* 두가지 선택지 존재
  1. Field가 독립구분되는 Index을 RDB의 테이블처럼 생각하고 설정하는 방법
  2. Type을 그대로 필드에 직접 customType으로 설정하는 방법.

### 4-1. Field가 독립구분되는 Index을 RDB의 테이블처럼 생각하고 설정하는 방법

(물론 이 방법으로도 RDB의 플로우를 완벽히 따라갈 순 없다. 부모의 PK field를 바로 삭제할 수 있기 떄문이다.)

* 기존 Type으로 부모관계를 설정할 때

```
curl -XGET "my_index/question,answer/_search" -H 'Content-Type:application/json' -d
...
```

* 변경된 부모관계 설정

```
curl -XGET "question,answer/_search" -H 'Content-Type:application/json' -d
...
```

### 4-2. Type을 그대로 필드에 직접 추가하는 방법(customType)
* 기존 Type으로 부모관계를 설정할 때

```
PUT my_index
{
  "mappings": {
    "question": {
      "properties": {
        "qid": { "type": "keyword" },
        "문제제목": { "type": "text" },
        "문제내용": { "type": "text" }
      }
    },
    "answer": {
      "properties": {
        "qid": { "type": "keyword" },
        "문제정답": { "type": "text" }
      }
    }
  }
}

PUT my_index/question/100
{
  "qid": "100",
  "문제제목": "깜짝퀴즈를 맞춰보세요",
  "문제내용": "1+1는?"
}

PUT my_index/answer/100
{
  "qid": "100",
  "문제정답": "귀요미"
}

GET my_index/question,answer/_search
{
  "query": {
    "match": {
      "qid": "100"
    }
  }
}
```

* 변경된 부모관계 설정

```
PUT my_index
{
  "mappings": {
    "_doc": {
      "properties": {
        "qid": { "type": "keyword" },
        # customType으로 직접 Type 설정
        "customType": { "type": "keyword" },
        "문제제목": { "type": "text" },
        "문제내용": { "type": "text" },
        "문제정답": { "type": "text" }
      }
    }
  }
}

PUT my_index/_doc/question-100
{
  "customType": "question",
  "qid": "100",
  "문제제목": "깜짝퀴즈를 맞춰보세요",
  "문제내용": "1+1는?"
}

PUT my_index/_doc/answer-100
{
  "customType": "answer",
  "qid": "100",
  "문제정답": "귀요미"
}

GET my_index/_search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "qid": "100"
        }
      },
      "filter": {
        "match": {
          "type": "answer question"
        }
      }
    }
  }
}

```

## 5. 추가적인 RDB와의 차이점
* RestApi를 통한 쿼리

> RDB는 SQL문을 날려 테이블에 삽입하였다면, ES는 RestAPI를 통해 CRUD operation이 가능하다.
>
> ```
> curl -XPUT "http://localhost:9200/my_index/_doc/1" -H 'Content-Type:application/json' -d' {"message":"안녕하세요 HB"}'
> ```

* 높은 비정형 데이터 색인 효율성

> 예로 우리가 `HB`라는 단어를 포함하는 row를 뽑고싶다라고 했을 때, RDB는 모든 row를 다 뽑아서 특정단어포함여부를 따로 전부 확인해야한다. 즉, 긴 텍스트(비정형 데이터)를 색인하고 검색하는것이 힘들다. 하지만, ES는 다음과 같이 비정형 데이터를 검색할 수 있다.
>
> ```
> curl -XGET "http://localhost:9200/my_index/_search"
> {
>   "query":{
>     "match": {
>       "message": "HB"
>     }
>   }
> }
> ```

* 트랜잭션과 롤백 기능이 없다
* 데이터의 업데이트를 제공하지 않는다
  * 삭제 후 삽입

## 문법

URI은 **기본적**으로 `{ES-ip}:{ES-port} / {INDEX} / {method=[_doc, _search, ...]} / {id}` 를 따라간다.

이외에 상세한 문법은 자세히 설명된 자료가 있어 간단하게 첨부한다.

[https://github.com/kimjmin/elastic-demo/blob/master/demos/get-started/elasticsearch-7x.md](https://github.com/kimjmin/elastic-demo/blob/master/demos/get-started/elasticsearch-7x.md)
