
window.onload = async function () {
    initMainView();
}

const initMainView = async () => {
    await setRestAPIMainView(async function (result) {

        //먼저 화면 구성 시작
        await initMarketListTable(result);

        if (result.success) {
            let page = "mainView";
            let order = result.data;
            let payment = "KRW"

            connectWS({ page, order, payment }, async function (result) {
                await setSocketView(result, order);
            });
        }
    });
}

//첫 접근시 restAPI 요청으로 화면 구성
const setRestAPIMainView = async (callback) => {
    let callbackData = {
        success: false,
        data: [],
    }




    let tickerInfo = await setTickerAPI("mainView", "ALL", "KRW")


    let rankMap = new Map();
    //탑 랭크 코인을 저장할 맵 형태의 객체
    let topRankCoin = new Array;

    let key
    let value

    //전일 기준 , 24시간 기준아님 
    let close_rate;
    let test = [];
    for (let i = 0; i < Object.keys(tickerInfo).length; i++) {
        //close_rate = (Object.values(tickerInfo)[i].closing_price - Object.values(tickerInfo)[i].prev_closing_price) / Object.values(tickerInfo)[i].prev_closing_price * 100
        key = Object.keys(tickerInfo)[i];
        //value = close_rate; 
        value = Object.values(tickerInfo)[i].fluctate_rate_24H; //Object.values(tickerInfo)[i].fluctate_rate_24H;

        rankMap.set(key, value)
        test.push(key)
    }

    //상승률로 정렬시킴.
    rankMap = new Map([...rankMap].sort((a, b) => a[1] - b[1]));

    //정렬시킨 MAP 의 키값을 전부 가져옴.
    const keys = Array.from(rankMap.keys()); // 👉️ ['name', 'age']


    //뒤에서 부터 제일 상승이 큰 코인인데 2부터 시작하는 이유는 맨뒤에 DATE 값이 undefined로 날라옴..
    let keyCheckNum = 1;
    const rankdiv = document.querySelector(".slide_card")
    let rankTitle = rankdiv.querySelectorAll(".slide1 > .title")
    let rankPrice = rankdiv.querySelectorAll(".slide1 > .price")
    let rankPecent = rankdiv.querySelectorAll(".slide1 > .percent")

    //탑 5 코인의 currency 정보를 가져와서 최상위 5개의 변동률 차트를 그려준다.
    for (let i = 0; i < 5; i++) {
        keyCheckNum = keyCheckNum + 1;
        let candleInfo = await setCandleStick("mainView", `${keys[keys.length - keyCheckNum]}_KRW`);
        candleInfo = candleInfo.slice(candleInfo.length - 150, candleInfo.length);

        if (candleInfo) {
            rankTitle[i].innerHTML = keys[keys.length - keyCheckNum]
            rankTitle[i].name = keys[keys.length - keyCheckNum];
            rankPrice[i].innerHTML = Number(tickerInfo[keys[keys.length - keyCheckNum]].closing_price).toLocaleString()
            rankPecent[i].innerHTML = "+" + Number(tickerInfo[keys[keys.length - keyCheckNum]].fluctate_rate_24H) + "%"
            //미니차트 만들기
            let target = document.querySelectorAll(".slide_card > .slide1 > .mini_chart");
            target[i].id = `container_${keys[keys.length - keyCheckNum]}_KRW`
            getMainMiniChart("container_" + keys[keys.length - keyCheckNum] + "_KRW", candleInfo)

            //  //랭킹 소켓 통신을 위해 코인이름을 담아서 콜백
            //  callbackData.data.push(keys[keys.length - keyCheckNum]);
        }
    }
    callbackData.data = tickerInfo
    callbackData.success = true;
    return callback(callbackData)
}

//소켓 데이터 정보를 받아서 화면 뿌려줌.
const setSocketView = (data, rankKey) => {
    data = JSON.parse(data)
    //top 5위 랭킹 실시간 정보


    let isRank = false;
    let rankDom;
    if (data && data.content && data.content.symbol) {
        rankDom = document.getElementById("container_" + data.content.symbol);
    }

    rankDom ? isRank = true : isRank = false;


    //해당 코인정보는 탑5 코인 정보이다.
    if (isRank) {
        let target = rankDom.parentNode;
        const rankdiv = document.querySelector(".slide_card")
        target.querySelector(".price").innerHTML = Number(data.content.closePrice).toLocaleString()
        target.querySelector(".percent").innerHTML = "+" + data.content.chgRate + "%"
    }


    let target;

    if (data && data.content && data.content.symbol && document.getElementsByClassName(data.content.symbol)[0]) {
        target = document.getElementsByClassName(data.content.symbol)[0];
        target = target.parentNode.parentNode;
        let rateDOM = target.getElementsByClassName("rate")[0]
        let priceDom = target.getElementsByClassName("price")[0]
        let volumeDom = target.getElementsByClassName("volume")[0]

        //24시 등락률이 0보다 클 경우 상승
        if (Number(data.content.chgRate) >= 0) {
            rateDOM.classList.remove("down_blue_color")
            rateDOM.classList.add("up_red_color")
        } else {
            rateDOM.classList.remove("up_blue_color")
            rateDOM.classList.add("down_blue_color")
        }

        priceDom.innerHTML = Number(data.content.closePrice).toLocaleString() + " 원"
        rateDOM.innerHTML = Number(data.content.chgAmt).toLocaleString() + " 원 (" + data.content.chgRate + " %)"
        volumeDom.innerHTML = Number(data.content.value).toLocaleString() + " 원"
        // target.getElementsByClassName("value")[0].innerHTML = 
    }


}

//restAPI 모든 코인을 메인화면에 세팅해주는 컴포넌트
const initMarketListTable = async (data) => {
    let target = document.querySelector("#crypto_list_table > tbody");
    let favoriteCookie = getCookie("favorite");
    console.log("favoriteCookie", favoriteCookie)
    let data_value;
    let data_key;
    let length = Object.keys(data.data).length;

    for (let i = 0; i < length; i++) {
        let tr = document.createElement("tr");
        let favorite = document.createElement("td");
        let title = document.createElement("td");
        let symbol = document.createElement("p");
        let price = document.createElement("td");
        let rate = document.createElement("td");
        let volume = document.createElement("td");
        let value = document.createElement("td");

        data_key = Object.keys(data.data)
        data_value = Object.values(data.data)

        favorite.classList.add("favorite")
        favorite.classList.add("star_fill")
        tr.appendChild(favorite)

        //제목
        title.classList.add("title")
        title.innerHTML = "코인이름"
        symbol.innerHTML = data_key[i] + "_KRW"
        symbol.classList.add(data_key[i] + "_KRW")
        symbol.name = data_key[i] + "_KRW"

        title.appendChild(symbol)
        tr.appendChild(title)
        //상승인지 하락인지.

        price.classList.add("price")

        price.innerHTML = Number(data_value[i].closing_price).toLocaleString() + " 원"
        tr.appendChild(price)

        rate.classList.add("rate")
        rate.innerHTML = Number(data_value[i].fluctate_24H).toLocaleString() + "  원 (" + data_value[i].fluctate_rate_24H + " %)"
        tr.appendChild(rate)

        volume.classList.add("volume")
        volume.innerHTML = Number(data_value[i].acc_trade_value_24H).toLocaleString() + "원";
        tr.appendChild(volume)

        value.classList.add("value")
        value.innerHTML = "시가총액"
        tr.appendChild(value)


        //24시 등락률이 0보다 클 경우 상승
        if (Number(data_value[i].fluctate_rate_24H) >= 0) {
            rate.classList.add("up_red_color")
        } else {
            rate.classList.add("down_blue_color")
        }

        /*즐겨찾기 클릭 이벤트*/
        favorite.addEventListener("click", function (event) {
            //현재 내가 클릭한 TD 를
            let target = this.parentNode;
            let targetName = target.querySelector(".title > p").innerHTML;
            console.log("targetName", targetName)
            //td 부모인 tr 맨 앞으로 다시 넣기.
            let parentTarget = this.parentNode.parentNode;
            parentTarget.prepend(target);



            //클릭하는 순간 최상단으로 올라와야함.
            if (favorite.classList.contains("star_fill")) {
                favorite.classList.remove("star_fill")
                favorite.classList.add("star_full")

                if(favoriteCookie.indexOf(targetName) !== -1) {
                    console.log("잇음!!")
                } else {
                    console.log("없음!!")
                }
                
            } else {
                favorite.classList.add("star_fill")
                favorite.classList.remove("star_full")
            }

            //쿠키에 즐겨찾기 한거 세팅.

            if (!favoriteCookie) {
                setCookie("favorite", ";" + targetName + ";")
            } else {
                setCookie("favorite", favoriteCookie + targetName + ";")
            }
        })


        target.appendChild(tr)

    }


}