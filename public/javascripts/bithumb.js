let whaleAleartCount = 0;

/**
 * 첫 화면 로딩시 소켓 연결 시작
 * 
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

    getMiniChart("container_ETH");
    getMiniChart("container_BTC");
    getMiniChart("container_XRP");
    getMiniChart("container_BCH");
    getMiniChart("container_MATIC");
}
/* socket response 정보를 받아 swiching 시켜 화면을 구성 요청*/
const getBithumbCryptoInfo = (result) => {
    const data = JSON.parse(result);
    const el = [{
        bithumbBTC :{
            "KRW" : document.getElementById('bithumb_BTC_krw'),
            "RATE" : document.getElementById('bithumb_BTC_signed_change_rate'),
            "VOLUME" : document.getElementById('bithumb_BTC_acc_trade_volume_24h'),
            "VALUE" : document.getElementById('bithumb_BTC_acc_trade_value_24h'),
            "VOLUMEPOWER" : document.getElementById('bithumb_BTC_acc_trade_volumePower_24h'),
        },
        bithumbETH :{
            "KRW" : document.getElementById('bithumb_ETH_krw'),
            "RATE" : document.getElementById('bithumb_ETH_signed_change_rate'),
            "VOLUME" : document.getElementById('bithumb_ETH_acc_trade_volume_24h'),
            "VALUE" : document.getElementById('bithumb_ETH_acc_trade_value_24h'),
            "VOLUMEPOWER" : document.getElementById('bithumb_ETH_acc_trade_volumePower_24h'),
        },
        bithumbXRP :{
            "KRW" : document.getElementById('bithumb_XRP_krw'),
            "RATE" : document.getElementById('bithumb_XRP_signed_change_rate'),
            "VOLUME" : document.getElementById('bithumb_XRP_acc_trade_volume_24h'),
            "VALUE" : document.getElementById('bithumb_XRP_acc_trade_value_24h'),
            "VOLUMEPOWER" : document.getElementById('bithumb_XRP_acc_trade_volumePower_24h'),
        },
        bithumbBCH :{
            "KRW" : document.getElementById('bithumb_BCH_krw'),
            "RATE" : document.getElementById('bithumb_BCH_signed_change_rate'),
            "VOLUME" : document.getElementById('bithumb_BCH_acc_trade_volume_24h'),
            "VALUE" : document.getElementById('bithumb_BCH_acc_trade_value_24h'),
            "VOLUMEPOWER" : document.getElementById('bithumb_BCH_acc_trade_volumePower_24h'),
        },
        bithumbMATIC :{
            "KRW" : document.getElementById('bithumb_MATIC_krw'),
            "RATE" : document.getElementById('bithumb_MATIC_signed_change_rate'),
            "VOLUME" : document.getElementById('bithumb_MATIC_acc_trade_volume_24h'),
            "VALUE" : document.getElementById('bithumb_MATIC_acc_trade_value_24h'),
            "VOLUMEPOWER" : document.getElementById('bithumb_MATIC_acc_trade_volumePower_24h'),
            
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
            element.bithumbBTC.KRW.innerHTML = `${(Number(resTicker.closePrice).toLocaleString())}원`; 
            element.bithumbBTC.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`; 
            element.bithumbBTC.VOLUME.innerHTML = `${(Number(resTicker.volume).toFixed(2))} BTC`; 
            element.bithumbBTC.VALUE.innerHTML = ` ${numberToKorean(Number(resTicker.value).toFixed(0))}원`; 
            element.bithumbBTC.VOLUMEPOWER.innerHTML = ` ${Number(resTicker.volumePower)}%`; 

            //현재(종가)가격이 시가 보다 낮은 경우
            if(resTicker.closePrice < resTicker.openPrice) {
                setChangeToColor("down", element.bithumbBTC.KRW)
                setChangeToColor("down", element.bithumbBTC.RATE)
            } else {
                setChangeToColor("up", element.bithumbBTC.KRW)
            }

            break;
        case "ETH_KRW" :
            element.bithumbETH.KRW.innerHTML = `${(Number(resTicker.closePrice).toLocaleString())}원`; 
            element.bithumbETH.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`; 
            element.bithumbETH.VOLUME.innerHTML = `${(Number(resTicker.volume).toFixed(2))} ETH`; 
            element.bithumbETH.VALUE.innerHTML = ` ${numberToKorean(Number(resTicker.value).toFixed(0))}원`; 
            element.bithumbETH.VOLUMEPOWER.innerHTML = ` ${Number(resTicker.volumePower)}%`; 

            //현재(종가)가격이 시가 보다 낮은 경우
            if(resTicker.closePrice < resTicker.openPrice) {
                setChangeToColor("down", element.bithumbETH.KRW)
                setChangeToColor("down", element.bithumbETH.RATE)
            } else {
                setChangeToColor("up", element.bithumbETH.KRW)
            }

            break;
        case "XRP_KRW" :
            element.bithumbXRP.KRW.innerHTML = `${(Number(resTicker.closePrice).toLocaleString())}원`; 
            element.bithumbXRP.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`; 
            element.bithumbXRP.VOLUME.innerHTML = `${(Number(resTicker.volume).toFixed(2))} XRP`; 
            element.bithumbXRP.VALUE.innerHTML = ` ${numberToKorean(Number(resTicker.value).toFixed(0))}원`; 
            element.bithumbXRP.VOLUMEPOWER.innerHTML = ` ${Number(resTicker.volumePower)}%`; 
            
            //현재(종가)가격이 시가 보다 낮은 경우
            if(resTicker.closePrice < resTicker.openPrice) {
                setChangeToColor("down", element.bithumbXRP.KRW)
                setChangeToColor("down", element.bithumbXRP.RATE)
            } else {
                setChangeToColor("up", element.bithumbXRP.KRW)
            }
            break;
        case "BCH_KRW" :
            element.bithumbBCH.KRW.innerHTML = `${(Number(resTicker.closePrice).toLocaleString())}원`; 
            element.bithumbBCH.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`; 
            element.bithumbBCH.VOLUME.innerHTML = `${(Number(resTicker.volume).toFixed(2))} XRP`; 
            element.bithumbBCH.VALUE.innerHTML = ` ${numberToKorean(Number(resTicker.value).toFixed(0))}원`; 
            element.bithumbBCH.VOLUMEPOWER.innerHTML = ` ${Number(resTicker.volumePower)}%`;
            
            //현재(종가)가격이 시가 보다 낮은 경우
            if(resTicker.closePrice < resTicker.openPrice) {
                setChangeToColor("down", element.bithumbBCH.KRW)
                setChangeToColor("down", element.bithumbBCH.RATE)
            } else {
                setChangeToColor("up", element.bithumbBCH.KRW)
            }
            break;
        case "MATIC_KRW" :
            element.bithumbMATIC.KRW.innerHTML = `${(Number(resTicker.closePrice).toLocaleString())}원`; 
            element.bithumbMATIC.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`; 
            element.bithumbMATIC.VOLUME.innerHTML = `${(Number(resTicker.volume).toFixed(2))} XRP`; 
            element.bithumbMATIC.VALUE.innerHTML = ` ${numberToKorean(Number(resTicker.value).toFixed(0))}원`; 
            element.bithumbMATIC.VOLUMEPOWER.innerHTML = ` ${Number(resTicker.volumePower)}%`;

            //현재(종가)가격이 시가 보다 낮은 경우
            if(resTicker.closePrice < resTicker.openPrice) {
                setChangeToColor("down", element.bithumbMATIC.KRW)
                setChangeToColor("down", element.bithumbMATIC.RATE)
            } else {
                setChangeToColor("up", element.bithumbMATIC.KRW)
            }
            break;
    }
}


const setTransactionData = (data,el) => {
    const element = el[0];
    const response = data.content.list[data.content.list.length - 1];

    switch(response.symbol) {
        case "BTC_KRW" :
            setTransactionList(response,"BTC_transaction")
            break;
        case "ETH_KRW" :
            setTransactionList(response,"ETH_transaction")
            break;
        case "XRP_KRW" :
            setTransactionList(response,"XRP_transaction")
            break;
        case "BCH_KRW" :
            setTransactionList(response,"BCH_transaction")
            break;
        case "MATIC_KRW" :
            setTransactionList(response,"MATIC_transaction")
            break;
    }
}



const setTransactionList = (response,targetid) => {
    const time = new Date(response.contDtm);
    const color = response.buySellGb;

    let target = document.getElementById(targetid)

    let tr = document.createElement("tr")
    tr.classList.add("transactionContent")
    tr.id = "BTC_transaction"


    color === "1" ? tr.style.color = "#f75467 " : tr.style.color = "#4386f9";

    let transactionTime = document.createElement("td")
    transactionTime.innerHTML = time.toLocaleTimeString();
    tr.appendChild(transactionTime)

    let transactionPrice = document.createElement("td")
    transactionPrice.innerHTML = `${Number(response.contPrice).toLocaleString()}원`;
    tr.appendChild(transactionPrice);

    let transactionCount = document.createElement("td")
    transactionCount.innerHTML =  `${Number(response.contQty).toFixed(3)}개`; response.contQty
    tr.appendChild(transactionCount)

    target.appendChild(tr)
}


