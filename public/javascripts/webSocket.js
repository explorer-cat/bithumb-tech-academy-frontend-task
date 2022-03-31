/**
 * bithum api connection
 *
 * @created 최성우 2022-03 00:00 최초 개발
 */

 var socket; // 소켓

 // 웹소켓 연결
 function connectWS(callback) {
     if(socket != undefined){
         socket.close();
     }
     socket = new WebSocket("wss://pubwss.bithumb.com/pub/ws");
     socket.onopen 	= function(e){
          filterRequest('{"type":"ticker","symbols":["BTC_KRW","ETH_KRW","XRP_KRW","BCH_KRW","MATIC_KRW"],"tickTypes":["24H"]}');
          filterRequest('{"type":"transaction","symbols":["BTC_KRW","ETH_KRW","XRP_KRW"],"tickTypes":["24H"]}');
          filterRequest('{"type":"orderbookdepth", "symbols":["BTC_KRW" , "ETH_KRW" ,"XRP_KRW"]}');
          }
     socket.onclose = function(e){
            socket = undefined;
          }
     socket.onmessage= function(e){
          return callback(e.data)
          }		
 }
 
 // 웹소켓 연결 해제
 function closeWS() {
     if(socket != undefined){
         console.log("closing requested");
         socket.close();
         socket = undefined;
     }	
 }
 

 // 웹소켓 요청
 function filterRequest(filter) {
         if(socket == undefined){
             alert('no connect exists');
             return;
         }
         socket.send(filter);
 }
 

/*
 * 전일 대비 상승,보합,하락에 따라 document의 색상을 변경해주는 함수
 * RISE : 상승  EVEN : 보합  FALL : 하락
 * 
 * @created 최성우 2022-03-31
 * @param change <string> RISE : 상승  up : 보합  down : 하락
 * @param el <object> 색상을 변경할 element 
 */





