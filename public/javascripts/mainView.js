window.onload = async function () {
    initMainView();
}

const initMainView = async () => {
    let tickerInfo = await setTickerAPI("mainView", "ALL", "KRW")
    console.log("tickerInfo", tickerInfo)

    let sample = ["BTC_KRW","ETH_KRW","XRP_KRW","BCH_KRW","MATIC_KRW"];

    //탑 5 코인의 currency 정보를 가져와서 최상위 5개의 변동률 차트를 그려준다.
    for(let i = 0; i < sample.length; i++) {
        let candleInfo = await setCandleStick("mainView", sample[i]);
        candleInfo = candleInfo.slice( candleInfo.length - 150, candleInfo.length);
        if(candleInfo) {
            getMainMiniChart("container_"+sample[i], candleInfo)
        }
    }

    //전체 크립토 정보중에서 상위 상승률 5개 이름을 가져와서 TD 세팅하고 세팅할때 아이디값 해당 정보로 세팅하고 차트 만들어주면댐.

    //
    // setTransactionAPI(page, order, payment)
    // setCandleStick(page, order, payment)

    // getMiniChart("mini_chart", miniChartData)
}
