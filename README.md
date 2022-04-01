## codestates-bithumb-frontend
>

## 완성된 GIF 파일 및 배포 링크
>

## 프로젝트 실행 방법
> npm install express.js  or npm install
> noe start bin/www

## 사용한 스택 목록
- nodejs
- expressjs 
- javascript
- css3
- websocket
- apexcharts
- highcharts.js

## 구현한 기능 목록 (Software Requirement Specification)
> 공통 
- 전체 레이아웃 구성
- 사이드 메뉴 레이아웃 구성
- 캐로셀 카드 형태 레이아웃 구현

> 카드 기능
- small 카드 형태 뷰 화면 구현 (현재가격, 등락률, 24시간 거래량, 24시간 거래금액, 체결강도)
- big 카드 형태 뷰 화면 구현 (오더북, 매수 매도 호가창, 실시간 체결 내역)
- 호버시 카드 자동 펼치기 애니메이션 구현
- 카드 모두 접기, 카드 모두 펼치기 이벤트 구현
- 코인 일봉차트 기능 구현 (highcharts.js)

## 구현 방법 및 구현하면서 어려웠던 점
> 구현방법
- 빗썸 홈페이지를 최소한 참고하여 다른 색다른 형태의 코인정보화면을 구현하기 위해 노력했습니다.
- 소켓 데이터를 VIEW 화면으로 callback 하여 데이터의 Type 을 스위칭 하는 방식으로 화면을 구성했습니다.
- response 된 소켓 데이터를 chart 에 전송하여 일봉 차트를 구성하였습니다.

> 구현하면서 어려웠던 점
- chart 라이브러리를 사용하다보니 chart option 만으로는 원하는 차트를 도출하기 힘들었습니다.
- 중복된 호가 정보 orderbookDepth 정보를 가공하는게 어려웠습니다. 
- 자유로운 UI/UX 이다보니, 레이아웃과 기능 기획단계부터 많은 시간이 들었습니다.
빗썸 시그니처 생삭과 background를 사용하여 빗썸 느낌의 또 다른 UI/UX를 구성했습니다.



## (가산점) 직접 작성한 Wireframe 혹은 Prototype (figma 등의 다양한 툴 활용)
>

## (가산점) 성능 최적화에 대해서 고민하고 개선한 방법
>



## 정보

[https://github.com/explorer-cat](https://github.com/explorer-cat)
