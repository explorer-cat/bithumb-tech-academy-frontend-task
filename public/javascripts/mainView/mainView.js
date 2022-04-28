window.onload = async function () {


    /* aside event handler */
    document.getElementById("main-page").addEventListener("click", clickAsideCategory)
    document.getElementById("trade-page").addEventListener("click", clickAsideCategory)
    // document.querySelector(".list_title > td:nth-child(2)").addEventListener("click", sortTable)

    initMainView();

    console.log("listing", listing)


    document.getElementById("total_search").addEventListener("keyup",function() {
        let searchText = this.value;
        
        //검색어를 다 지우거나 검색어가 없는경우.
        if(searchText.length <= 0) {
            //전체 테이블의 display를 보여줌.
            let allTr = document.querySelectorAll("#crypto_list_table > tbody > tr");

            for (let tr of allTr) {
                tr.style.display = ""
            }
        } 
        else {
            //검색어가 있는 경우
            let allTr = document.querySelectorAll("#crypto_list_table > tbody > tr");

            //전체 테이블을 display none 처리하고.
            for (let tr of allTr) {
                tr.style.display = "none"
            }
            //검색어를 모두 대문자로 변경한 후
            searchText = searchText.toUpperCase()
    
            //해당 검색어를 타이틀로 검색함.
            let temp = document.querySelectorAll(`[title*="${searchText}"]`)
    
            //해당 검색어에 걸린 td 의 부모 tr 만 none 해제
            for (let view of temp) {
                view.parentNode.style.display = ""
            }
        }
    })
	
}


const initMainView = async () => {
    setRestAPIMainView(async function (result) {

        //먼저 화면 구성 시작
        initMarketListTable(result);

        if (result.success) {
            let page = "mainView";
            let order = result.data;
            let payment = "KRW"

            /* 화면 구성이 종료된 후에 작동되어야하는 이벤트 리스너들 */
            document.getElementById("favorite_crpyto").addEventListener("click", clickCategoryTab)
            document.getElementById("korea_market_cap").addEventListener("click", clickCategoryTab)


            connectWS({ page, order, payment }, async function (result) {
                setSocketView(result, order);
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
    let data_value;
    let data_key;
    let length = Object.keys(data.data).length;


    data_key = Object.keys(data.data)
    data_value = Object.values(data.data)


    let status

    for (let i = 0; i < length; i++) {

        let tr
        let favorite
        let title
        let symbol
        let price
        let rate
        let volume
        let value

        
         tr = document.createElement("tr");
         favorite = document.createElement("td");
         title = document.createElement("td");
         symbol = document.createElement("p");
         price = document.createElement("td");
         rate = document.createElement("td");
         volume = document.createElement("td");
         value = document.createElement("td");


         favorite.classList.add("favorite")

         if (localStorage.getItem(data_key[i] + "_KRW")) {
            favorite.classList.add("star_full")
         } else {
            favorite.classList.add("star_fill")
         }
        tr.appendChild(favorite)

        //제목
        title.classList.add("title")
        title.innerHTML = data_key[i]
        title.title = data_key[i]
        title.style.fontWeight = "800"
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

        value.classList.add("chart")
        value.id = data_key[i] + "_table_chart"
        // value.innerHTML = "24시간 추이"
        tr.appendChild(value)

        //24시간 추이 차트 렌더시작

        /* 즐겨찾기 된 코인과 안된코인을 분리해서 화면 나눠서 처리해줌*/
        if (localStorage.getItem(data_key[i] + "_KRW")) {
            // 맨앞에 보이게
            target.prepend(tr)
        } else {
            target.appendChild(tr)
        }

        //24시 등락률이 0보다 클 경우 상승
        if (Number(data_value[i].fluctate_rate_24H) >= 0) {
            rate.classList.add("up_red_color")
            //상승일 경우 테이블 차트 색상도 빨간색으로
        } else {
            rate.classList.add("down_blue_color")
        }


        /*즐겨찾기 클릭 이벤트*/




        if (rate.classList.contains("up_red_color")) {
            status = "#d60000"
        } else {
            status = "#0051c7"
        }

        favorite.addEventListener("click", function (event) {
            //현재 내가 클릭한 TD 를
            let target = this.parentNode;
            let targetName = target.querySelector(".title > p").innerHTML;
            console.log("targetName", targetName)
            //td 부모인 tr 맨 앞으로 다시 넣기.ƒd
            let parentTarget = this.parentNode.parentNode;



            //클릭하는 순간 최상단으로 올라와야함.
            if (favorite.classList.contains("star_fill")) {
                favorite.classList.remove("star_fill")
                favorite.classList.add("star_full")
                parentTarget.prepend(target);
                //localstorage 에 즐겨찾기한 코인 추가
                localStorage.setItem(targetName, 'star')

            } else {
                //즐겨찾기 탭에서 즐겨찾기를 해제할 경우 
                if (document.getElementsByClassName("tab_selected")[0].id === "favorite_crpyto") {
                    //해당 코인 즐겨찾기 탭에서 안보이게하기
                    target.classList.add("display_none")
                }
                favorite.classList.add("star_fill")
                favorite.classList.remove("star_full")

                // //맨밑으로
                parentTarget.appendChild(target);

                //localstorage 에 즐겨찾기한 코인 삭제
                localStorage.removeItem(targetName)
            }
        })
    

    }

    /* 차트 생성 병렬처리.. */
    const setChart = async (object,status) => {
        let data = await setCandleStick("mainView",object,"1h")
        data.slice(data.length - 24, data.length);
        getTableMiniChart(object + "_table_chart", data, status)
    }

    let cryptoType = [];

    for await(let object of Object.keys(data.data)) {
        cryptoType.push(object);
    }

    const taskPromises = cryptoType.map(candle => setChart(candle,status))
    await Promise.all(taskPromises);
}


function sortTable() {
    var table = document.getElementById('crypto_list_table');

    console.log("table")
    var rows = table.rows;
    console.log("rows", rows)
    for (var i = 1; i < (rows.length - 1); i++) {
        var fCell = rows[i].cells[1];
        var sCell = rows[i + 1].cells[1];
        if (fCell.innerHTML.toLowerCase() > sCell.innerHTML.toLowerCase()) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        }
    }
}

