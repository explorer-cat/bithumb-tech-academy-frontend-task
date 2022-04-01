let whaleAleartCount = 0;
let bitcoin_global_price;
//매수 주문
let orderbookDataBid = new Map();
//매도 주문
let orderbookDataAsk = new Map();

let bitMapAsk = new Map();
let bitMapBid = new Map();
let ethMapAsk = new Map();
let ethMapBid = new Map();
let xrpMapAsk = new Map();
let xrpMapBid = new Map();
let bchMapAsk = new Map();
let bchMapBid = new Map();
let maticMapAsk = new Map();
let maticMapBid = new Map();

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
        bithumbBTC: {
            "KRW": document.getElementById('bithumb_BTC_krw'),
            "RATE": document.getElementById('bithumb_BTC_signed_change_rate'),
            "VOLUME": document.getElementById('bithumb_BTC_acc_trade_volume_24h'),
            "VALUE": document.getElementById('bithumb_BTC_acc_trade_value_24h'),
            "VOLUMEPOWER": document.getElementById('bithumb_BTC_acc_trade_volumePower_24h'),
        },
        bithumbETH: {
            "KRW": document.getElementById('bithumb_ETH_krw'),
            "RATE": document.getElementById('bithumb_ETH_signed_change_rate'),
            "VOLUME": document.getElementById('bithumb_ETH_acc_trade_volume_24h'),
            "VALUE": document.getElementById('bithumb_ETH_acc_trade_value_24h'),
            "VOLUMEPOWER": document.getElementById('bithumb_ETH_acc_trade_volumePower_24h'),
        },
        bithumbXRP: {
            "KRW": document.getElementById('bithumb_XRP_krw'),
            "RATE": document.getElementById('bithumb_XRP_signed_change_rate'),
            "VOLUME": document.getElementById('bithumb_XRP_acc_trade_volume_24h'),
            "VALUE": document.getElementById('bithumb_XRP_acc_trade_value_24h'),
            "VOLUMEPOWER": document.getElementById('bithumb_XRP_acc_trade_volumePower_24h'),
        },
        bithumbBCH: {
            "KRW": document.getElementById('bithumb_BCH_krw'),
            "RATE": document.getElementById('bithumb_BCH_signed_change_rate'),
            "VOLUME": document.getElementById('bithumb_BCH_acc_trade_volume_24h'),
            "VALUE": document.getElementById('bithumb_BCH_acc_trade_value_24h'),
            "VOLUMEPOWER": document.getElementById('bithumb_BCH_acc_trade_volumePower_24h'),
        },
        bithumbMATIC: {
            "KRW": document.getElementById('bithumb_MATIC_krw'),
            "RATE": document.getElementById('bithumb_MATIC_signed_change_rate'),
            "VOLUME": document.getElementById('bithumb_MATIC_acc_trade_volume_24h'),
            "VALUE": document.getElementById('bithumb_MATIC_acc_trade_value_24h'),
            "VOLUMEPOWER": document.getElementById('bithumb_MATIC_acc_trade_volumePower_24h'),

        }
    }]


    switch (data.type) {
        case "ticker" :
            setTickerData(data, el);
            break;
        case "transaction" :
            setTransactionData(data, el);
            break;
        case "orderbookdepth" :
            setOrderBookDepthData(data, el);
            break;
    }
}


const setTickerData = (data, el) => {
    const element = el[0];

    let resTicker = data.content

    switch (resTicker.symbol) {
        case "BTC_KRW" :
            bitcoin_global_price = Number(resTicker.closePrice);

            element.bithumbBTC.KRW.innerHTML = `${(Number(resTicker.closePrice).toLocaleString())}원`;
            element.bithumbBTC.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`;
            element.bithumbBTC.VOLUME.innerHTML = `${(Number(resTicker.volume).toFixed(2))} BTC`;
            element.bithumbBTC.VALUE.innerHTML = ` ${numberToKorean(Number(resTicker.value).toFixed(0))}원`;
            element.bithumbBTC.VOLUMEPOWER.innerHTML = ` ${Number(resTicker.volumePower)}%`;

            //현재(종가)가격이 시가 보다 낮은 경우
            if (resTicker.closePrice < resTicker.openPrice) {
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
            if (resTicker.closePrice < resTicker.openPrice) {
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
            console.log("resTicker.closePrice", resTicker.closePrice)
            console.log("resTicker.openPrice", resTicker.openPrice)
            if (resTicker.closePrice < resTicker.openPrice) {
                setChangeToColor("down", element.bithumbXRP.KRW)
                setChangeToColor("down", element.bithumbXRP.RATE)
            } else {
                setChangeToColor("up", element.bithumbXRP.KRW)
            }
            break;
        case "BCH_KRW" :
            element.bithumbBCH.KRW.innerHTML = `${(Number(resTicker.closePrice).toLocaleString())}원`;
            element.bithumbBCH.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`;
            element.bithumbBCH.VOLUME.innerHTML = `${(Number(resTicker.volume).toFixed(2))} BCH`;
            element.bithumbBCH.VALUE.innerHTML = ` ${numberToKorean(Number(resTicker.value).toFixed(0))}원`;
            element.bithumbBCH.VOLUMEPOWER.innerHTML = ` ${Number(resTicker.volumePower)}%`;

            //현재(종가)가격이 시가 보다 낮은 경우
            if (resTicker.closePrice < resTicker.openPrice) {
                setChangeToColor("down", element.bithumbBCH.KRW)
                setChangeToColor("down", element.bithumbBCH.RATE)
            } else {
                setChangeToColor("up", element.bithumbBCH.KRW)
            }
            break;
        case "MATIC_KRW" :
            element.bithumbMATIC.KRW.innerHTML = `${(Number(resTicker.closePrice).toLocaleString())}원`;
            element.bithumbMATIC.RATE.innerHTML = `전일대비 ${resTicker.chgRate}%`;
            element.bithumbMATIC.VOLUME.innerHTML = `${(Number(resTicker.volume).toFixed(2))} MATIC`;
            element.bithumbMATIC.VALUE.innerHTML = ` ${numberToKorean(Number(resTicker.value).toFixed(0))}원`;
            element.bithumbMATIC.VOLUMEPOWER.innerHTML = ` ${Number(resTicker.volumePower)}%`;

            //현재(종가)가격이 시가 보다 낮은 경우
            if (resTicker.closePrice < resTicker.openPrice) {
                setChangeToColor("down", element.bithumbMATIC.KRW)
                setChangeToColor("down", element.bithumbMATIC.RATE)
            } else {
                setChangeToColor("up", element.bithumbMATIC.KRW)
            }
            break;
    }
}


const setTransactionData = (data, el) => {
    const element = el[0];
    const response = data.content.list[data.content.list.length - 1];

    switch (response.symbol) {
        case "BTC_KRW" :
            setTransactionList(response, "BTC_transaction")
            break;
        case "ETH_KRW" :
            setTransactionList(response, "ETH_transaction")
            break;
        case "XRP_KRW" :
            setTransactionList(response, "XRP_transaction")
            break;
        case "BCH_KRW" :
            setTransactionList(response, "BCH_transaction")
            break;
        case "MATIC_KRW" :
            setTransactionList(response, "MATIC_transaction")
            break;
    }
}


const setTransactionList = (response, targetid) => {
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
    transactionCount.innerHTML = `${Number(response.contQty).toFixed(3)}개`;
    response.contQty
    tr.appendChild(transactionCount)

    target.appendChild(tr)
}




const setOrderBookDepthData = (data) => {
    let list;
    let bitcoin_price;

    list = data.content.list;


    switch (list[0].symbol) {
        case "BTC_KRW" :
            let bit_ask = document.getElementById("bit_ask")
            let bit_bid = document.getElementById("bit_bid")

            for (const data of list) {
                if(data.orderType === "ask") {
                    bitMapAsk.set(data.price,data.quantity);
                } else {
                    bitMapBid.set(data.price,data.quantity);
                }
            }
            
            let tempSortAsk = new Map([...bitMapAsk.entries()].sort());
            let askMap = new Map([...tempSortAsk.entries()].reverse())


            let AskTR = document.querySelectorAll("#orderBook_BTC_ask > tbody > tr");

            for(const tr of AskTR) {
                tr.remove();
            }

            askMap.forEach( (value, key, map) => {
                if(Number(value).toFixed(4) !== "0.0000") {
                    let tr = document.createElement("tr")
                    let price = document.createElement("td")
                    let count = document.createElement("td")

                    price.innerHTML = Number(key).toLocaleString();
                    count.innerHTML = Number(value).toFixed(4)

                    tr.appendChild(price);
                    tr.appendChild(count);
                    bit_ask.appendChild(tr);
            }
        });


        
        let tempSortBid = new Map([...bitMapBid.entries()].sort());
        let BidMap = new Map([...tempSortBid.entries()].reverse())


        let BidTR = document.querySelectorAll("#orderBook_BTC_bid > tbody > tr");

        for(const tr of BidTR) {
            tr.remove();
        }

        BidMap.forEach( (value, key, map) => {
            if(Number(value).toFixed(4) !== "0.0000") {
                let tr = document.createElement("tr")
                let price = document.createElement("td")
                let count = document.createElement("td")

                price.innerHTML = Number(key).toLocaleString();
                count.innerHTML = Number(value).toFixed(4)

                tr.appendChild(price);
                tr.appendChild(count);
                bit_bid.appendChild(tr);
            }
          });


            break;
        case "ETH_KRW" :
            let eth_ask = document.getElementById("eth_ask")
            let eth_bid = document.getElementById("eth_bid")

            for (const data of list) {
                if(data.orderType === "ask") {
                    ethMapAsk.set(data.price,data.quantity);
                } else {
                    ethMapBid.set(data.price,data.quantity);
                }
            }
            
            let ETHtempSortAsk = new Map([...ethMapAsk.entries()].sort());
            let ETHaskMap = new Map([...ETHtempSortAsk.entries()].reverse())


            var EthAskTR = document.querySelectorAll("#orderBook_ETH_ask > tbody > tr");

            for(const tr of EthAskTR) {
                tr.remove();
            }

            ETHaskMap.forEach( (value, key, map) => {
                if(Number(value).toFixed(4) !== "0.0000") {
                    let tr = document.createElement("tr")
                    let price = document.createElement("td")
                    let count = document.createElement("td")

                    price.innerHTML = Number(key).toLocaleString();
                    count.innerHTML = Number(value).toFixed(4)

                    tr.appendChild(price);
                    tr.appendChild(count);
                    eth_ask.appendChild(tr);
            }
        });


        
        let ETHtempSortBid = new Map([...ethMapBid.entries()].sort());
        let ETHBidMap = new Map([...ETHtempSortBid.entries()].reverse())


        let Eth_BidTR = document.querySelectorAll("#orderBook_ETH_bid > tbody > tr");

        for(const tr of Eth_BidTR) {
            tr.remove();
        }

        ETHBidMap.forEach( (value, key, map) => {
            if(Number(value).toFixed(4) !== "0.0000") {
                let tr = document.createElement("tr")
                let price = document.createElement("td")
                let count = document.createElement("td")

                price.innerHTML = Number(key).toLocaleString();
                count.innerHTML = Number(value).toFixed(4)

                tr.appendChild(price);
                tr.appendChild(count);
                eth_bid.appendChild(tr);
            }
          });

            break;
        case "XRP_KRW" :
            let xrp_ask = document.getElementById("xrp_ask")
            let xrp_bid = document.getElementById("xrp_bid")

            for (const data of list) {
                if(data.orderType === "ask") {
                    xrpMapAsk.set(data.price,data.quantity);
                } else {
                    xrpMapBid.set(data.price,data.quantity);
                }
            }
            
            let XRP_tempSortAsk = new Map([...xrpMapAsk.entries()].sort());
            let XRP_askMap = new Map([...XRP_tempSortAsk.entries()].reverse())


            var XRP_AskTR = document.querySelectorAll("#orderBook_XRP_ask > tbody > tr");

            for(const tr of XRP_AskTR) {
                tr.remove();
            }

            XRP_askMap.forEach( (value, key, map) => {
                if(Number(value).toFixed(4) !== "0.0000") {
                    let tr = document.createElement("tr")
                    let price = document.createElement("td")
                    let count = document.createElement("td")

                    price.innerHTML = Number(key).toLocaleString();
                    count.innerHTML = Number(value).toFixed(4)

                    tr.appendChild(price);
                    tr.appendChild(count);
                    xrp_ask.appendChild(tr);
            }
        });


        
        let XRP_tempSortBid = new Map([...xrpMapBid.entries()].sort());
        let XRP_BidMap = new Map([...XRP_tempSortBid.entries()].reverse())


        let XRP_BidTR = document.querySelectorAll("#orderBook_XRP_bid > tbody > tr");

        for(const tr of XRP_BidTR) {
            tr.remove();
        }

        XRP_BidMap.forEach( (value, key, map) => {
            if(Number(value).toFixed(4) !== "0.0000") {
                let tr = document.createElement("tr")
                let price = document.createElement("td")
                let count = document.createElement("td")

                price.innerHTML = Number(key).toLocaleString();
                count.innerHTML = Number(value).toFixed(4)

                tr.appendChild(price);
                tr.appendChild(count);
                xrp_bid.appendChild(tr);
            }
          });

            break;
        case "BCH_KRW" :
            let bch_ask = document.getElementById("bch_ask")
            let bch_bid = document.getElementById("bch_bid")

            for (const data of list) {
                if(data.orderType === "ask") {
                    bchMapAsk.set(data.price,data.quantity);
                } else {
                    bchMapBid.set(data.price,data.quantity);
                }
            }
            
            let BCH_tempSortAsk = new Map([...bchMapAsk.entries()].sort());
            let BCH_askMap = new Map([...BCH_tempSortAsk.entries()].reverse())


            var BCH_AskTR = document.querySelectorAll("#orderBook_BCH_ask > tbody > tr");

            for(const tr of BCH_AskTR) {
                tr.remove();
            }

            BCH_askMap.forEach( (value, key, map) => {
                if(Number(value).toFixed(4) !== "0.0000") {
                    let tr = document.createElement("tr")
                    let price = document.createElement("td")
                    let count = document.createElement("td")

                    price.innerHTML = Number(key).toLocaleString();
                    count.innerHTML = Number(value).toFixed(4)

                    tr.appendChild(price);
                    tr.appendChild(count);
                    bch_ask.appendChild(tr);
            }
        });


        
        let BCH_tempSortBid = new Map([...bchMapBid.entries()].sort());
        let BCH_BidMap = new Map([...BCH_tempSortBid.entries()].reverse())


        let BCH_BidTR = document.querySelectorAll("#orderBook_BCH_bid > tbody > tr");

        for(const tr of BCH_BidTR) {
            tr.remove();
        }

        BCH_BidMap.forEach( (value, key, map) => {
            if(Number(value).toFixed(4) !== "0.0000") {
                let tr = document.createElement("tr")
                let price = document.createElement("td")
                let count = document.createElement("td")

                price.innerHTML = Number(key).toLocaleString();
                count.innerHTML = Number(value).toFixed(4)

                tr.appendChild(price);
                tr.appendChild(count);
                bch_bid.appendChild(tr);
            }
          });

            break;
        case "MATIC_KRW" :
            let matic_ask = document.getElementById("matic_ask")
            let matic_bid = document.getElementById("matic_bid")

            for (const data of list) {
                if(data.orderType === "ask") {
                    maticMapAsk.set(data.price,data.quantity);
                } else {
                    maticMapBid.set(data.price,data.quantity);
                }
            }
            
            let MATIC_tempSortAsk = new Map([...maticMapAsk.entries()].sort());
            let MATIC_askMap = new Map([...MATIC_tempSortAsk.entries()].reverse())


            var MATIC_AskTR = document.querySelectorAll("#orderBook_MATIC_ask > tbody > tr");

            for(const tr of MATIC_AskTR) {
                tr.remove();
            }

            MATIC_askMap.forEach( (value, key, map) => {
                if(Number(value).toFixed(4) !== "0.0000") {
                    let tr = document.createElement("tr")
                    let price = document.createElement("td")
                    let count = document.createElement("td")

                    price.innerHTML = Number(key).toLocaleString();
                    count.innerHTML = Number(value).toFixed(4)

                    tr.appendChild(price);
                    tr.appendChild(count);
                    matic_ask.appendChild(tr);
            }
        });


        
        let MATIC_tempSortBid = new Map([...maticMapBid.entries()].sort());
        let MATIC_BidMap = new Map([...MATIC_tempSortBid.entries()].reverse())


        let MATIC_BidTR = document.querySelectorAll("#orderBook_MATIC_bid > tbody > tr");

        for(const tr of MATIC_BidTR) {
            tr.remove();
        }

        MATIC_BidMap.forEach( (value, key, map) => {
            if(Number(value).toFixed(4) !== "0.0000") {
                let tr = document.createElement("tr")
                let price = document.createElement("td")
                let count = document.createElement("td")

                price.innerHTML = Number(key).toLocaleString();
                count.innerHTML = Number(value).toFixed(4)

                tr.appendChild(price);
                tr.appendChild(count);
                matic_bid.appendChild(tr);
            }
          });

            break;
    }
}