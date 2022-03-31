let whaleAleartCount = 0;

/**
 * 첫 화면 로딩시 소켓 연결 시작
 *
 * @created 최성우 2022-03 00:00 최초 개발
 */


window.onload = async function () {
    /* 카드 고정하기 버튼 이벤트 */
    document.getElementById("open_all_card").addEventListener("click", setAllCardOpenClose)
    document.getElementById("close_all_card").addEventListener("click", setAllCardOpenClose)

    /* response 정보를 받아옵니다. */
    connectWS(async function (result) {
        getBithumbCryptoInfo(result);
    });
    getMiniChart();
}
/* socket response 정보를 받아 swiching 시켜 화면을 구성 요청*/
const getBithumbCryptoInfo = (result) => {
    const data = JSON.parse(result);
    const el = [{
        bithumbBTC :{
            "KRW" : document.getElementById('bithumb_BTC_krw'),
            "RATE" : document.getElementById('bithumb_BTC_signed_change_rate'),
        },
        bithumbETH :{
            "KRW" : document.getElementById('bithumb_ETH_krw'),
            "RATE" : document.getElementById('bithumb_ETH_signed_change_rate'),
        },
        bithumbXRP :{
            "KRW" : document.getElementById('bithumb_XRP_krw'),
            "RATE" : document.getElementById('bithumb_XRP_signed_change_rate'),
        },
        bithumbBCH :{
            "KRW" : document.getElementById('bithumb_BCH_krw'),
            "RATE" : document.getElementById('bithumb_BCH_signed_change_rate'),
        },
        bithumbMATIC :{
            "KRW" : document.getElementById('bithumb_MATIC_krw'),
            "RATE" : document.getElementById('bithumb_MATIC_signed_change_rate'),
        }
    }]


    switch(data.type) {
        case "ticker" :
            setTickerData(data,el);
            break;
        case "transaction" :
            setTransactionData(data,el);
            break;

    }
}



const setTickerData = (data,el) => {
    const element = el[0];

    let resTicker = data.content

    switch(resTicker.symbol) {
        case "BTC_KRW" :
            //bithumbBTC.RATE.innerHTML = `전일대비 ${(data.signed_change_rate * 100).toFixed(2)}%`;
            element.bithumbBTC.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`;
            document.getElementById('bithumb_BTC_acc_trade_volume_24h').innerHTML = `${(Number(resTicker.volume).toFixed(2))} BTC`; 
            document.getElementById('bithumb_BTC_acc_trade_value_24h').innerHTML = ` ${numberToKorean(Number(resTicker.value).toFixed(0))}원`; 
    
            break;
        case "ETH_KRW" :
            // element.bithumbETH.KRW.innerHTML = `${resTicker.closePrice.toLocaleString()}원`;
            element.bithumbETH.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`;
            document.getElementById('bithumb_ETH_acc_trade_volume_24h').innerHTML = ` ${(Number(resTicker.volume).toFixed(2))} ETH`; 
            break;
        case "XRP_KRW" :
            console.log("dfdfdfd")
            // element.bithumbXRP.KRW.innerHTML = `${resTicker.closePrice.toLocaleString()}원`;
            element.bithumbXRP.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`;
            document.getElementById('bithumb_XRP_acc_trade_volume_24h').innerHTML = ` ${(Number(resTicker.volume).toFixed(2))} XRP`; 
            break;
        case "BCH_KRW" :
            // element.bithumbXRP.KRW.innerHTML = `${resTicker.closePrice.toLocaleString()}원`;
            element.bithumbBCH.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`;
            document.getElementById('bithumb_BCH_acc_trade_volume_24h').innerHTML = ` ${(Number(resTicker.volume).toFixed(2))} XRP`; 
            break;
        case "MATIC_KRW" :
                // element.bithumbXRP.KRW.innerHTML = `${resTicker.closePrice.toLocaleString()}원`;
            element.bithumbMATIC.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`;
            document.getElementById('bithumb_MATIC_acc_trade_volume_24h').innerHTML = ` ${(Number(resTicker.volume).toFixed(2))} XRP`; 
            break;
    }
}


const setTransactionData = (data,el) => {
    const element = el[0];
    const response = data.content.list[data.content.list.length - 1];

    switch(response.symbol) {
        case "BTC_KRW" :
            element.bithumbBTC.KRW.innerHTML = `${Number(response.contPrice).toLocaleString()}원`;
            setChangeToColor(response.updn, element.bithumbBTC.KRW);
            break;
        case "ETH_KRW" :
            element.bithumbETH.KRW.innerHTML = `${Number(response.contPrice).toLocaleString()}원`;
            setChangeToColor(response.updn, element.bithumbETH.KRW);
            break;
        case "XRP_KRW" :
            element.bithumbXRP.KRW.innerHTML = `${Number(response.contPrice).toLocaleString()}원`;
            setChangeToColor(response.updn, element.bithumbXRP.KRW);
            break;
        case "BCH_KRW" :
            element.bithumbBCH.KRW.innerHTML = `${Number(response.contPrice).toLocaleString()}원`;
            setChangeToColor(response.updn, element.bithumbXRP.KRW);
            break;
        case "MATIC_KRW" :
            element.bithumbMATIC.KRW.innerHTML = `${Number(response.contPrice).toLocaleString()}원`;
            setChangeToColor(response.updn, element.bithumbXRP.KRW);
            break;
    }
}







/* 첫화면 구성을 위한 REST API 요청 */
const getBithumbAPI = () => {

}


const setAllCardOpenClose = (event) => {
    console.log("event!")
}

const setChangeToColor = (change,el) => {
    if(change === "up") {
            el.classList.add("up_red_color")
            el.classList.remove("down_blue_color")
    } else {
            el.classList.add("down_blue_color")
            el.classList.remove("up_red_color")
    } 
}


const numberToKorean = (obj) =>{
    if(obj){
        const formatter = Intl.NumberFormat();
        if(obj > 99999999999) {
            var jo = String(obj).slice(0,-12);
            obj = (obj % 1000000000000);
            var eok = (obj / 100000000).toFixed(1);
            if(formatter.format(jo) === 0) {
                return formatter.format(jo) + '조 ' + formatter.format(eok) + '억';
            } else {
                return formatter.format(eok) + '억';    
            }
        } else if (obj > 99999999) {
            obj = (obj / 100000000).toFixed(0);
            return formatter.format(obj) + '억';
        } else {
            return formatter.format(obj);
        }
    } 
    return obj;
}