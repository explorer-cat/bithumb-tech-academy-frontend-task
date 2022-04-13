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
                order : order,
                payment : payment,
            }
        })


    try {
        if(!request.data.data)return

        let tkData = request.data.data;
        console.log("tkData", tkData)

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
        dom.RATE.innerHTML = `24시간 ${Number(tkData.fluctate_rate_24H)} %`;
        dom.VOLUME.innerHTML = `${Number(tkData.units_traded_24H).toFixed(2)} BTC`;
        dom.VALUE.innerHTML = `${numberToKorean(Number(tkData.acc_trade_value_24H).toFixed(0))} BTC`;
        dom.POWER.innerHTML = `${Number()}`;
        dom.LOW.innerHTML = `${numberToKorean(Number(tkData.min_price))}`;
        dom.HIGH.innerHTML = `${numberToKorean(Number(tkData.max_price))}`;
        dom.FINISH.innerHTML = `${numberToKorean(Number(tkData.prev_closing_price))}`;

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


const setOrderBookAPI = async (page, order, payment) => {
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

        let obData = request.data.data;
        console.log("obData", obData)
    } catch (e) {

    }

}
