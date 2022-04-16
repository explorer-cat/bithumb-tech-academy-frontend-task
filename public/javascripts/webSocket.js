/**
 * bithum api connection
 *
 * @created 최성우 2022-03 00:00 최초 개발
 */

 var socket; // 소켓

 // 웹소켓 연결
 function connectWS({page,order,payment},callback) {
     if(socket != undefined){
         socket.close();
     }
     socket = new WebSocket("wss://pubwss.bithumb.com/pub/ws");
     socket.onopen 	= function(e){

          filterRequest(`{"type":"ticker","symbols":["${order}_${payment}"],"tickTypes":["24H"]}`);
          filterRequest(`{"type":"transaction","symbols":["${order}_${payment}"],"tickTypes":["24H"]}`);
          filterRequest(`{"type":"orderbookdepth", "symbols":["${order}_${payment}"]}`);
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
         console.log("s*******소켓 연결 해제 **********")
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
 

