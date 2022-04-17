/**
 * 
 * @param {*} page : view 를 구성해주기 위한 현재 페이지 정보
 * @param {*} order  : 주문 통화(코인), ALL(전체), 기본값 : BTC
 * @param {*} payment : 결제 통화(마켓), 입력값 : KRW 혹은 BTC
 * @param {*} callback : callback
 */
const setTickerAPI = async (page, order, payment) => {
    let result = {
        success: false,
    }
    let request = await axios.request(
        {
            method: 'POST',
            url: `api/ticker`,
            headers: { 'Content-Type': 'application/json' },
            data : {
                order : "All",
                payment : payment,
            }
        })


    try {
        if(!request.data.data)return




        //코인리스트 컴포넌트 세팅

        let tkData = request.data.data[`${order}`];
   //     console.log("tkData", tkData[`${order}`])

        //실시간 정보를 받아서 우측 리스트박스 세팅 리스트는 전체 정보를 다보내줘서 처리
        bitcoin_global_price = request.data.data.BTC.prev_closing_price;
        eth_global_price =  request.data.data.ETH.prev_closing_price;
        
        initCryptoListComponent(request.data.data);
        


        let dom = {
            "KRW": document.getElementById('tr_krw'),
            "RATE": document.getElementById('tr_change_rate'),
            "VOLUME": document.getElementById('tr_volume'),
            "VALUE": document.getElementById('tr_value'),
            "POWER": document.getElementById('tr_power'),
            "LOW": document.getElementById('tr_low'),
            "HIGH": document.getElementById('tr_high'),
            "FINISH": document.getElementById('tr_finish'),
        }

        // div : crypto_content_info_box
        dom.KRW.innerHTML = `${numberToKorean(Number(tkData.closing_price))}원`;
        // dom.RATE.innerHTML = `${Number(tkData.fluctate_rate_24H)} %`;
        dom.VOLUME.innerHTML = `${Number(tkData.units_traded_24H).toFixed(2)} ${getCookie("order")}`;
        dom.VALUE.innerHTML = `${numberToKorean(Number(tkData.acc_trade_value_24H).toFixed(0))}원`;
        dom.POWER.innerHTML = `${Number()}`;
        dom.LOW.innerHTML = `${numberToKorean(Number(tkData.min_price))}`;
        dom.HIGH.innerHTML = `${numberToKorean(Number(tkData.max_price))}`;
        dom.FINISH.innerHTML = `${numberToKorean(Number(tkData.prev_closing_price))}`;

        if (tkData.prev_closing_price > tkData.closing_price) {
            setChangeToColor("down", dom.KRW)
            setChangeToColor("down", dom.RATE)

            dom.RATE.innerHTML = `-${tkData.fluctate_rate_24H}%`;
            document.getElementById("tr_change_rate").classList.add("bg_down");

        } else {
            setChangeToColor("up", dom.KRW)
            setChangeToColor("up", dom.RATE)

            dom.RATE.innerHTML = `+${tkData.fluctate_rate_24H}%`;
            
            document.getElementById("tr_change_rate").classList.add("bg_up");
        }



        return request.data.data;
    } catch (e) {

    }
}

const setTransactionAPI = async (page, order, payment) => {
    let result = {
        success: false,
    }
    let request = await axios.request(
        {
            method: 'POST',
            url: `api/transaction`,
            headers: { 'Content-Type': 'application/json' },
            data : {
                order : order,
                payment : payment,
            }
        });

    try {
        if(!request.data.data)return

        let res = request.data.data;

        for (const trData of res) {
            const time = new Date(trData.transaction_date);
            const type = trData.type;
        
            let target = document.getElementById("BTC_transaction")
        
            let tr = document.createElement("tr")
            tr.classList.add("transactionContent")
            tr.id = "BTC_transaction"
        
        
            type === "bid" ? tr.style.color = "#f75467 " : tr.style.color = "#4386f9";
        
            let transactionTime = document.createElement("td")
            transactionTime.innerHTML = time.toLocaleTimeString();
            tr.appendChild(transactionTime)
        
            let transactionPrice = document.createElement("td")
            transactionPrice.innerHTML = `${Number(trData.price).toLocaleString()}원`;
            tr.appendChild(transactionPrice);
        
            let transactionCount = document.createElement("td")
            transactionCount.innerHTML = `${Number(trData.units_traded).toFixed(3)}개`;
            tr.appendChild(transactionCount)
        
            target.prepend(tr)
        }
    } catch (e) {

    }

}


const setOrderBookAPI = async (page, order, payment, ticker) => {
    let result = {
        success: false,
    }
    let request = await axios.request(
        {
            method: 'POST',
            url: `api/orderbook`,
            headers: { 'Content-Type': 'application/json' },
            data : {
                order : order,
                payment : payment,
            }
        });

    try {
        if(!request.data.data)return

        console.log("ticker", ticker)
        let obData = request.data.data;
        let tr;
        let price;
        let count;




        for await (const asks of obData.asks) {
            tr = document.createElement("tr")
            price = document.createElement("td")
            count = document.createElement("td")
            percent = document.createElement("td")

           price.innerHTML = Number(asks.price).toLocaleString();
           percent.innerHTML = `${((Number(asks.price) - Number(ticker.prev_closing_price)) / Number(asks.price) * 100).toFixed(2)} %`
           count.innerHTML = Number(asks.quantity).toFixed(4)

           tr.style.backgroundColor = "#eef6ff"
            console.log("push!!")


           tr.appendChild(price);
           tr.appendChild(percent);
           tr.appendChild(count);
        
           bit_ask.prepend(tr);
        }


        for await (const bids of obData.bids) {
            tr = document.createElement("tr")
            price = document.createElement("td")
            percent = document.createElement("td")
            count = document.createElement("td")

           price.innerHTML = Number(bids.price).toLocaleString();

           percent.innerHTML = `${((Number(bids.price) - Number(ticker.prev_closing_price)) / Number(bids.price) * 100).toFixed(2)} %`

           count.innerHTML = Number(bids.quantity).toFixed(4)
           tr.style.backgroundColor = "#fff0ef"

           tr.appendChild(price);
           tr.appendChild(percent);
           tr.appendChild(count);
           bit_ask.appendChild(tr);

           

        }


        const special= document.getElementById("bit_ask");

        console.log("special" , special.offsetHeight)
        //23px 짜리 td 가 40개니까 - margin padding 빼기
        special.scrollTo( 0, 900/2 );

    } catch (e) {

    }

}


const setCandleStick = async(page,order,payment) => {
    console.log(this)
    let result = {
        success: false,
    }

    let request = await axios.request(
        {
            method: 'POST',
            url: `api/candlestick`,
            headers: { 'Content-Type': 'application/json' },
            data : {
                order : order,
                payment : payment,
            }
        });

    try {
        if(!request.data.data)return

        let obData = request.data.data;

        if(page === "tradeView") {
            //미니차트를 그리기 위한 최근 1500분간  10분단위의 거래 내역
            let miniChartData = obData.slice( obData.length - 150, obData.length);

            console.log("miniChartData", new Date(miniChartData[0][0]).toLocaleTimeString())
            console.log("miniChartData", new Date(miniChartData[19][0]).toLocaleTimeString())


            let target = document.getElementsByClassName("chart_info_category")[0];
            let chart = document.createElement("div")
            chart.id = "container_BTC"
            target.appendChild(chart)
            getMiniChart("container_BTC", miniChartData)
        }
    } catch (e) {

    }

}


function convertHMS(value) {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours   = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
}