---
layout: default
title: 크롤링 프로젝트
parent: 토이 프로젝트
nav_order: 3
---

작업 환경 : Pycharm(python3.6)

사용 라이브러리 : selenium(3.141.0v), beautifulsoup4(4.8.2), pyqt5(5.13.0v), pandas(1.0.1v), numpy(1.18.1v), xlsxWriter(1.2.8v), pip(20.0.2v), cx_freeze(6.1v)

파일 :
1. extract.py : Login.class = 로그인, Ui_Dialog.class = 메인화면
2. crowling.py : crolw(주소,id,pw).class = 크롤링
3. test.py : exportCsv(문자열, 모델).class = DB재정렬
   * 모델==0: 사람 검색하여 Ui_Dialog.class의 QTableView에 출력
   * 모델==1: 전체 excel export
   * 모델==2: 사람 excel export
   * 모델==3: 전체 검색하여 Ui_Dialog.class의 QTableView에 출력
4. setup.py : cx_freeze로 exe파일 추출.

![p3](../../../assets/img/etc/그림3.png)
![p1](../../../assets/img/etc/그림1.png)

### 완료된 목록

1) CSV데이터 깨짐현상 수정.
- txt로 받아서 다시 csv로 재인코딩.

2) CSV대신 excel사용
- 한 개의 CSV파일에 여러개 시트가 있을 수 없음으로, 용량과 시간이 커지지만 xlsx확장자 사용.
- xlsx로 전체 테이블 생성시간은 약 3분 소요된다.

3) pyqt5사용하여 Qtableview에 dataframe출력.

4) 검색기능 구현.
- acc_no에 입력 후 검색 시, 전체 버튼이 isClicked()일 때 모두 표시, 아닐 때 acc_no가 맞는 사람만 표시.

5) csv저장 기능 구현.
- 전체 버튼이 isClicked()일 때, _user_all.xlsx파일에 데이터 추가.
- 전체 버튼이 꺼져있고 acc_no의 값이 입력되어 있을 때, acc_no + “_” + 테이블종류.csv 로 총 5개의 csv파일 생성
- 실행파일폴더에 csv생성.

6) 로그인
- 주소, ID ,PW를 받아와 extract.py의 Ui_Dialog클래스 init부분에서 crowling 실행.(selenium, bs4 사용)

7) 크롤링으로 csv파일을 받아올 때, Headless로 구현 및 속도 향상.
- csv데이터를 읽는데 보편적으로 쓰이는 것이 Pandas.lib이지만 데이터 크기가 커질수록읽거나쓸 때 느려지는 단점이 있다. 따라서 Pyarrow라이브러리를 활용하여 csv파일처리 속도를 향상시킨다. 메모리 절약은 해결할 수 없다. multi thread를 사용하기 때문에 속도가 빠르다.
