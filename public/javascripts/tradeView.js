/*현재가 전역*/
let bitcoin_global_price;
let eth_global_price;

/*종가 전역*/
let bit_global_prev;
let eth_global_prev;

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

    /*첫 접근시 쿠키가 없다면 기본 쿠키정보로 세팅 */
    if (!getCookie("page") || !getCookie("order") || !getCookie("payment")) {
        setCookie("page", "tradeView", 1);
        setCookie("order", "BTC", 1);
        setCookie("payment", "KRW", 1);
    }

    const page = getCookie("page");
    const order = getCookie("order");
    const payment = getCookie("payment");

    /* 오더 주문 리스트 초기화 */
    let AskTR = document.querySelectorAll("#bit_ask > tr");
    bitMapAsk = new Map();
    bitMapBid = new Map();

    for (const tr of AskTR) {
        tr.remove();
    }

    let tickerInfo = await setTickerAPI(page, order, payment)

    setTransactionAPI(page, order, payment)
    setCandleStick(page, `${order + "_" + payment}`)
    // setOrderBookAPI(page,order,payment ,tickerInfo)


    //기본 차트
    tradeChart(order,"3m",1000000000);


    if (document.getElementById("container_BTC")) {
        document.getElementById("container_BTC").remove();
    }


    // 이벤트 로드
    document.getElementById("mini_chart").removeEventListener("click", getTradeMiniChart);
    document.getElementById("mini_chart").addEventListener("click", getTradeMiniChart);

    document.getElementById("main-page").addEventListener("click", clickAsideCategory)


    /* 차트 시간 버튼 이벤트 */


    document.getElementById("1m").addEventListener("click",function(event) {
        event.preventDefault()
        tradeChart(document.getElementById("crypto_title").innerHTML,"1m",60000000);
    })

    document.getElementById("3m").addEventListener("click",function(event) {
        event.preventDefault()
        tradeChart(document.getElementById("crypto_title").innerHTML,"3m",1800000000);
    })


    document.getElementById("1h").addEventListener("click",function(event) {
        event.preventDefault() 
        tradeChart(document.getElementById("crypto_title").innerHTML,"1h",10000000000);
    })

    document.getElementById("1day").addEventListener("click",function(event) {
        event.preventDefault()
        tradeChart(document.getElementById("crypto_title").innerHTML,"24h",30000000000);
    })


    connectWS(({ page, order, payment }), async function (result) {
        await getBithumbCryptoInfo(result);
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
            setOrderBookDepthData(data);
            break;
    }
}

const setTickerData = (data, el) => {
    const element = el[0];

    let resTicker = data.content

    let status = `${getCookie("order")}_${getCookie("payment")}`

    //페이지 쿠키와 동일한 정보만 가져

    // switch (resTicker.symbol) {
    //     case "BTC_KRW":
    //         bitcoin_global_price = resTicker.prevClosePrice;
    //         break;
    //     case "ETH_KRW":
    //         eth_global_price = resTicker.prevClosePrice;
    //         break;
    // }

    //실시간 정보를 받아서 우측 리스트박스 세팅
    setCryptoListComponent(resTicker);



    if (status === resTicker.symbol) {
        element.bithumbBTC.KRW.innerHTML = `${(Number(resTicker.closePrice).toLocaleString())}원`;
        element.bithumbBTC.VOLUME.innerHTML = `${(Number(resTicker.volume).toFixed(2))} ${getCookie("order")}`;
        element.bithumbBTC.VALUE.innerHTML = ` ${numberToKorean(Number(resTicker.value).toFixed(0))}원`;
        element.bithumbBTC.POWER.innerHTML = ` ${Number(resTicker.volumePower)}%`;
        element.bithumbBTC.LOW.innerHTML = ` ${numberToKorean(Number(resTicker.lowPrice))}`;
        element.bithumbBTC.HIGH.innerHTML = ` ${numberToKorean(Number(resTicker.highPrice))}`;
        element.bithumbBTC.FINISH.innerHTML = ` ${numberToKorean(Number(resTicker.prevClosePrice))}`;


        //현재(종가)가격이 시가 보다 낮은 경우

        if (resTicker.prevClosePrice > resTicker.closePrice) {
            setChangeToColor("down", element.bithumbBTC.KRW)
            setChangeToColor("down", element.bithumbBTC.RATE)

            element.bithumbBTC.RATE.innerHTML = `${resTicker.chgRate}%`;

            document.getElementById("tr_change_rate").classList.add("bg_down");

        } else {
            setChangeToColor("up", element.bithumbBTC.KRW)
            setChangeToColor("up", element.bithumbBTC.RATE)

            element.bithumbBTC.RATE.innerHTML = `${resTicker.chgRate}%`;

            document.getElementById("tr_change_rate").classList.add("bg_up");
        }

    }
}

const setTransactionData = (data, el) => {
    const element = el[0];
    const response = data.content.list[data.content.list.length - 1];
    setTransactionList(response, "BTC_transaction")

}

const setTransactionList = (response, targetid) => {

    const time = new Date(response.contDtm);
    const color = response.buySellGb;

    let status = `${getCookie("order")}_${getCookie("payment")}`

    //페이지 쿠키와 동일한 정보만 가져와

    if (status === response.symbol) {
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
}

const setOrderBookDepthData = (data, ticker) => {
    let list;
    let bitcoin_price;

    list = data.content.list;

    let status = `${getCookie("order")}_${getCookie("payment")}`
    //페이지 쿠키와 동일한 정보만 가져와
    if (status === list[0].symbol) {

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
                let count_bg_down = document.createElement("p")



                price.innerHTML = Number(key).toLocaleString();
                count.innerHTML = Number(value).toFixed(4)
                tr.style.backgroundColor = "#eef6ff"
                count_bg_down.classList.add("count_bg_down")

                let width;

                if (getCookie("order") === "BTC") {
                    percent.innerHTML = `${((Number(key) - Number(bitcoin_global_price)) / Number(key) * 100).toFixed(2)} %`
                    width = (Number(value).toFixed(4) / 10) * 10 + 1;
                } else if (getCookie("order") === "ETH") {
                    percent.innerHTML = `${((Number(key) - Number(eth_global_price)) / Number(key) * 100).toFixed(2)} %`
                    width = (Number(value).toFixed(4) / 10)
                }



                count_bg_down.style.width = width + "%"


                count.appendChild(count_bg_down)

                tr.appendChild(price);
                tr.appendChild(percent);
                tr.appendChild(count);
                document.getElementById("bit_ask").appendChild(tr)

            }
        });



        let tempSortBid = new Map([...bitMapBid.entries()].sort());
        let BidMap = new Map([...tempSortBid.entries()].reverse())


        let BidTR = document.querySelectorAll("#orderBook_BTC_bid > tbody > tr");

        for (const tr of BidTR) {
            tr.remove();
        }

        let tempCount;
        BidMap.forEach((value, key, map) => {
            if (Number(value).toFixed(4) !== "0.0000") {

                let tr = document.createElement("tr")
                let price = document.createElement("td")
                let count = document.createElement("td")
                let percent = document.createElement("td")

                let count_bg_up = document.createElement("p")

                price.innerHTML = Number(key).toLocaleString();


                let width;

                if (getCookie("order") === "BTC") {
                    percent.innerHTML = `${((Number(key) - Number(bitcoin_global_price)) / Number(key) * 100).toFixed(2)} %`
                    width = (Number(value).toFixed(4) / 10) * 10 + 1;
                } else if (getCookie("order") === "ETH") {
                    percent.innerHTML = `${((Number(key) - Number(eth_global_price)) / Number(key) * 100).toFixed(2)} %`
                    width = (Number(value).toFixed(4) / 10)
                }


                count_bg_up.style.width = width + "%"


                count.innerHTML = Number(value).toFixed(4)
                tr.style.backgroundColor = "#fff0ef"
                count_bg_up.classList.add("count_bg_up")


                count.appendChild(count_bg_up)
                tr.appendChild(price);
                tr.appendChild(percent);
                tr.appendChild(count);
                document.getElementById("bit_ask").appendChild(tr)
            }
        });

        let special = document.getElementById("bit_ask");
        // special.scrollTo(0, 900 / 2);

    }
}

/* 초기 코인 리스트 정적 */
const initCryptoListComponent = async (data) => {


    //전일 기준 , 24시간 기준아님 xs
    let keyTemp = [];
    let append = "";
    let listTarget = document.querySelector("#crypto_list_table > tbody")

    for await (let key of Object.keys(data)) {

        //value = close_rate; 
        //value = Object.values(data)[i].fluctate_rate_24H; //Object.values(tickerInfo)[i].fluctate_rate_24H;

        //  rankMap.set(key, value)
        keyTemp.push(key)
        append += `<tr id = "${key}_info">`

        append += `<td>${key}</td>`

        if (data[key].closing_price > data[key].prev_closing_price) {
            append += `<td class ="up_red_color">${Number(data[key].closing_price).toLocaleString()}</td>`
            append += `<td class ="up_red_color">${data[key].fluctate_rate_24H}%</td>`
        } else {
            append += `<td class = "down_blue_color">${Number(data[key].closing_price).toLocaleString()}</td>`
            append += `<td class ="down_blue_color">${data[key].fluctate_rate_24H}%</td>`
        }
        append += `<td>${numberToKorean(Number(data[key].acc_trade_value_24H).toFixed(0))}</td>`
        append += `</tr>`

        listTarget.innerHTML = append

    }


    for (let j = 0; j < keyTemp.length; j++) {
        document.getElementById(keyTemp[j] + "_info").addEventListener("click", moveToPage);

        // console.log("keyTemp",keyTemp)
        // let favorite = document.getElementById(`${keyTemp[i]}_favorite`);

        // favorite.addEventListener("click", function (event) {
        //     console.log("favorite", favorite)
        //     //현재 내가 클릭한 TD 를
        //     let target = this.parentNode;
        //     let targetName = target.querySelector(".title > p").innerHTML;
        //     console.log("targetName", targetName)
        //     //td 부모인 tr 맨 앞으로 다시 넣기.ƒd
        //     let parentTarget = this.parentNode.parentNode;


        //     //클릭하는 순간 최상단으로 올라와야함.
        //     if (favorite.classList.contains("star_fill")) {
        //         favorite.classList.remove("star_fill")
        //         favorite.classList.add("star_full")
        //         parentTarget.prepend(target);
        //         //localstorage 에 즐겨찾기한 코인 추가
        //         localStorage.setItem(targetName, 'star')

        //     } else {
        //         //즐겨찾기 탭에서 즐겨찾기를 해제할 경우 
        //         if (document.getElementsByClassName("tab_selected")[0].id === "favorite_crpyto") {
        //             //해당 코인 즐겨찾기 탭에서 안보이게하기
        //             target.classList.add("display_none")
        //         }
        //         favorite.classList.add("star_fill")
        //         favorite.classList.remove("star_full")

        //         // //맨밑으로
        //         parentTarget.appendChild(target);

        //         //localstorage 에 즐겨찾기한 코인 삭제
        //         localStorage.removeItem(targetName)
        //     }
        // })

    }

}

/* 초기 코인 리스트  */
const setCryptoListComponent = (data) => {

    let append = "";


    console.log("data", data)
    // console.log("data" ,data[`${getCookie("order")}`])
    let key = data.symbol.replace("_KRW", "")
    let listTarget = document.getElementById(`${key}_info`);

    if (!listTarget) {
        return;
    }

    append += `<td>${key}</td>`
    if (data.closePrice > data.prevClosePrice) {
        append += `<td class ="up_red_color up_box">${Number(data.closePrice).toLocaleString()}</td>`
        append += `<td class ="up_red_color">${data.chgRate}%</td>`
    } else {
        append += `<td class = "down_blue_color down_box">${Number(data.closePrice).toLocaleString()}</td>`
        append += `<td class ="down_blue_color">${data.chgRate}%</td>`
    }
    append += `<td>${numberToKorean(Number(data.value).toFixed(0))}</td>`

    listTarget.innerHTML = append


    console.log(listTarget.getElementsByClassName("up_box")[0])

    setTimeout(function () {
        if (listTarget.getElementsByClassName("up_box")[0]) {
            listTarget.getElementsByClassName("up_box")[0].classList.remove("up_box");
        }

        if (listTarget.getElementsByClassName("down_box")[0]) {
            listTarget.getElementsByClassName("down_box")[0].classList.remove("down_box");
        }
    }, 300);


}
