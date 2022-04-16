let whaleAleartCount = 0;
let bitcoin_global_price;
//매수 주문
let orderbookDataBid = new Map();
//매도 주문
let orderbookDataAsk = new Map();

let bitMapAsk = new Map();
let bitMapBid = new Map();


let orderMap = [];


/**
 * 첫 화면 로딩시 소켓 연결 시작
 *
 *
 * @created 최성우 2022-03 00:00 최초 개발
 */

async function initPage() {
    //소켓 존재하면 끊어!
    await  closeWS()

    const page = getCookie("page");
    const order = getCookie("order");
    const payment = getCookie("payment");

    
    let AskTR = document.querySelectorAll("#bit_ask > tr");

    bitMapAsk = new Map();
    bitMapBid = new Map();

    for await (const tr of AskTR) {
        tr.remove();
    }

    let tickerInfo = await setTickerAPI(page, order, payment)

    setTransactionAPI(page, order, payment)
    setCandleStick(page, order, payment)

    await tradeChart();
    await setCryptoListComponent();

    if (document.getElementById("container_BTC")) {
        document.getElementById("container_BTC").remove();
    }


    // 이벤트 로드
    document.getElementById("mini_chart").removeEventListener("click", getMiniChart);
    document.getElementById("mini_chart").addEventListener("click", getMiniChart);

    document.getElementById("crypto_info").removeEventListener("click", getCrpytoInfo);
    document.getElementById("crypto_info").addEventListener("click", getCrpytoInfo);

    document.getElementById("crypto_btc").removeEventListener("click", moveToPage);
    document.getElementById("crypto_btc").addEventListener("click", moveToPage);

    document.getElementById("crypto_eth").removeEventListener("click", moveToPage);
    document.getElementById("crypto_eth").addEventListener("click", moveToPage);


    connectWS(({ page, order, payment }), async function (result) {
        getBithumbCryptoInfo(result);
    });
}

window.onload = async function () {
    initPage();
}
/* socket response 정보를 받아 swiching 시켜 화면을 구성 요청*/
const getBithumbCryptoInfo = (result) => {
    const data = JSON.parse(result);
    const el = [{
        bithumbBTC: {
            "KRW": document.getElementById('tr_krw'),
            "RATE": document.getElementById('tr_change_rate'),
            "VOLUME": document.getElementById('tr_volume'),
            "VALUE": document.getElementById('tr_value'),
            "POWER": document.getElementById('tr_power'),
            "LOW": document.getElementById('tr_low'),
            "HIGH": document.getElementById('tr_high'),
            "FINISH": document.getElementById('tr_finish'),
        },
    }]

    switch (data.type) {
        case "ticker":
            setTickerData(data, el);
            break;
        case "transaction":
            setTransactionData(data, el);
            break;
        case "orderbookdepth":
            // setOrderBookAPI("tradeView","BTC","KRW",data);
            setOrderBookDepthData(data);
            break;
    }
}


const setTickerData = (data, el) => {
    const element = el[0];

    let resTicker = data.content


    //일봉을 만들어주기위한 차트 데이터 전송
    //tradeChart(data);
    bitcoin_global_price = resTicker.closePrice;
    element.bithumbBTC.KRW.innerHTML = `${(Number(resTicker.closePrice).toLocaleString())}원`;
    element.bithumbBTC.RATE.innerHTML = `24시간 ${resTicker.chgRate}%`;
    element.bithumbBTC.VOLUME.innerHTML = `${(Number(resTicker.volume).toFixed(2))} BTC`;
    element.bithumbBTC.VALUE.innerHTML = ` ${numberToKorean(Number(resTicker.value).toFixed(0))}원`;
    element.bithumbBTC.POWER.innerHTML = ` ${Number(resTicker.volumePower)}%`;
    element.bithumbBTC.LOW.innerHTML = ` ${numberToKorean(Number(resTicker.lowPrice))}`;
    element.bithumbBTC.HIGH.innerHTML = ` ${numberToKorean(Number(resTicker.highPrice))}`;
    element.bithumbBTC.FINISH.innerHTML = ` ${numberToKorean(Number(resTicker.closePrice))}`;


    //현재(종가)가격이 시가 보다 낮은 경우
    if (resTicker.closePrice < resTicker.openPrice) {
        setChangeToColor("down", element.bithumbBTC.KRW)
        setChangeToColor("down", element.bithumbBTC.RATE)
    } else {
        setChangeToColor("up", element.bithumbBTC.KRW)
    }


}


const setTransactionData = (data, el) => {
    const element = el[0];
    const response = data.content.list[data.content.list.length - 1];
    setTransactionList(response, "BTC_transaction")
         
}


const setTransactionList = (response, targetid) => {

    console.log("response", response)
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

    target.prepend(tr)
}




const setOrderBookDepthData = (data, ticker) => {
    let list;
    let bitcoin_price;

    list = data.content.list;




    for (const data of list) {
        if (data.orderType === "ask") {
            bitMapAsk.set(data.price, data.quantity);
        } else {
            bitMapBid.set(data.price, data.quantity);
        }
    }

    let tempSortAsk = new Map([...bitMapAsk.entries()].sort());
    let askMap = new Map([...tempSortAsk.entries()].reverse())


    let AskTR = document.querySelectorAll("#orderBook_BTC_ask > tbody > tr");

    for (const tr of AskTR) {
        tr.remove();
    }

    askMap.forEach((value, key, map) => {
        if (Number(value).toFixed(4) !== "0.0000") {
            let tr = document.createElement("tr")
            let price = document.createElement("td")
            let count = document.createElement("td")
            let percent = document.createElement("td")



            price.innerHTML = Number(key).toLocaleString();
            percent.innerHTML = `${((Number(key) - Number(bitcoin_global_price)) / Number(key) * 100).toFixed(2)} %`
            count.innerHTML = Number(value).toFixed(4)
            tr.style.backgroundColor = "#eef6ff"

            tr.appendChild(price);
            tr.appendChild(percent);
            tr.appendChild(count);
            bit_ask.appendChild(tr);
        }
    });



    let tempSortBid = new Map([...bitMapBid.entries()].sort());
    let BidMap = new Map([...tempSortBid.entries()].reverse())


    let BidTR = document.querySelectorAll("#orderBook_BTC_bid > tbody > tr");

    for (const tr of BidTR) {
        tr.remove();
    }

    BidMap.forEach((value, key, map) => {
        if (Number(value).toFixed(4) !== "0.0000") {
            let tr = document.createElement("tr")
            let price = document.createElement("td")
            let count = document.createElement("td")
            let percent = document.createElement("td")

            price.innerHTML = Number(key).toLocaleString();
            percent.innerHTML = `${((Number(key) - Number(bitcoin_global_price)) / Number(key) * 100).toFixed(2)} %`
            count.innerHTML = Number(value).toFixed(4)
            tr.style.backgroundColor = "#fff0ef"
            tr.appendChild(price);
            tr.appendChild(percent);
            tr.appendChild(count);
            bit_ask.appendChild(tr);
        }
    });

    let special = document.getElementById("bit_ask");
    console.log("special.offsetHeight", special.offsetHeight)
    special.scrollTo(0, 900 / 2);


}


/*코인 리스트*/
const setCryptoListComponent = (data) => {
    let target = document.querySelector("#crypto_list_table > tbody")

    let append = "";
    append += '<tr id ="crypto_btc">'
    append += '<td>즐찾</td>'
    append += '<td>비트코인 </td>'
    append += '<td>50,560,000</td>'
    append += '<td> + 2.2%</td>'
    append += '<td> 6020만</td>'
    append += '</tr>'
    append += '<tr id ="crypto_eth">'
    append += '<td>즐찾</td>'
    append += '<td>이더리움 </td>'
    append += '<td>3,560,000</td>'
    append += '<td> + 4.2%</td>'
    append += '<td> 2020만</td>'
    append += '</tr>'

    target.innerHTML = append

}