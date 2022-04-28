
const setDetailView = (event) => {
    let target = event.target;

    /* 선택한 타겟 카드가 접힌 상태인지 확인한다.*/
    let cardStatus = false
    let detailCard

    target.closest(".not-detail-card") ? cardStatus = false : cardStatus = true



    /* targetStatus에 not-detail-card 클래스가 존재한다면 자세히 보지않는 카드이다.*/
    if (!cardStatus) {
        detailCard = target.closest(".not-detail-card")

        detailCard.classList.remove("not-detail-card");
        detailCard.classList.add("detail-card");
    }
    else {
        /* not-detail-card 클래스가 존재하지 않는다면 자세히 보기 상태인 카드이다. */
        detailCard = target.closest(".detail-card")

        detailCard.classList.remove("detail-card");
        detailCard.classList.add("not-detail-card");
    }
}

const setAllCardOpenClose = (event) => {
    const code = ["BTC", "ETH", "XRP", "BCH", "MATIC"]
    let allCard = document.querySelectorAll(".content-card");


    if (event.target.id === "open_all_card") {
        document.querySelector("#close_all_card").checked = false;

        code.forEach(function (item, index) {
            document.getElementById("container_" + item).style.display = "none"
            allCard[index].classList.add("fixed_open_card")
        })
    } else if (event.target.id === "close_all_card") {

        document.querySelector("#open_all_card").checked = false;

        code.forEach(function (item, index) {
            document.getElementById("container_" + item).style.display = ""
            allCard[index].classList.remove("fixed_open_card")
        })


    }



}

const setChangeToColor = (change, el) => {
    if (change === "up") {
        el.classList.add("up_red_color")
        el.classList.remove("down_blue_color")
    } else {
        el.classList.add("down_blue_color")
        el.classList.remove("up_red_color")
    }
}


const setChart = (event) => {
    let target = event.target;
    let targetName = ["btc_chart", "eth_chart", "xrp_chart", "bch_chart", "matic_chart"];

    switch (target.id) {
        case "bit_chart":
            if (document.querySelector(".btc_chart").style.getPropertyValue("display") === "none") {
                for (let i = 0; i < targetName.length; i++) {
                    if (targetName[i] !== "btc_chart") {
                        document.getElementsByClassName(targetName[i])[0].style.display = "none"
                    } else {
                        document.getElementsByClassName(targetName[i])[0].style.display = ""
                    }
                }
            }
            break;
        case "eth_chart":
            if (document.querySelector(".eth_chart").style.getPropertyValue("display") === "none") {
                for (let i = 0; i < targetName.length; i++) {
                    if (targetName[i] !== "eth_chart") {
                        document.getElementsByClassName(targetName[i])[0].style.display = "none"
                    } else {
                        document.getElementsByClassName(targetName[i])[0].style.display = ""
                    }
                }
            }
            break;
        case "xrp_chart":
            if (document.querySelector(".xrp_chart").style.getPropertyValue("display") === "none") {
                for (let i = 0; i < targetName.length; i++) {
                    if (targetName[i] !== "xrp_chart") {
                        document.getElementsByClassName(targetName[i])[0].style.display = "none"
                    } else {
                        document.getElementsByClassName(targetName[i])[0].style.display = ""
                    }
                }
            }
            break;
        case "bch_chart":
            if (document.querySelector(".bch_chart").style.getPropertyValue("display") === "none") {
                for (let i = 0; i < targetName.length; i++) {
                    if (targetName[i] !== "bch_chart") {
                        document.getElementsByClassName(targetName[i])[0].style.display = "none"
                    } else {
                        document.getElementsByClassName(targetName[i])[0].style.display = ""
                    }
                }
            }
            break;
        case "matic_chart":
            if (document.querySelector(".matic_chart").style.getPropertyValue("display") === "none") {
                for (let i = 0; i < targetName.length; i++) {
                    if (targetName[i] !== "matic_chart") {
                        document.getElementsByClassName(targetName[i])[0].style.display = "none"
                    } else {
                        document.getElementsByClassName(targetName[i])[0].style.display = ""
                    }
                }
            }
            break;

    }
}

/*미니 차트 생성*/
const setMiniChart = (event) => {

   
}

const getCrpytoInfo = (event) => {

    let target = document.getElementsByClassName("chart_info_category")[0];
    //차트 지우고
    if(!target.querySelector("ul > li:nth-child(2)").classList.contains("tab_selected")) {
        target.querySelector("ul > li:nth-child(1)").classList.remove("tab_selected")
        target.querySelector("ul > li:nth-child(2)").classList.add("tab_selected")
        document.getElementsByClassName("mini_crypto_info")[0].style.display = "";
        document.getElementById("container_BTC").style.display = "none";
      } else if(!document.getElementsByClassName("mini_crypto_info")[0]) {
        let coinInfoDiv = document.createElement("div");
        coinInfoDiv.classList.add("mini_crypto_info");
        target.appendChild(coinInfoDiv);
    
        let title = document.createElement("div")
        title.innerHTML = "비트코인에 관련한 정보가 들어올곳.";
        title.classList.add("padding-a-8")
        coinInfoDiv.appendChild(title)
    
      }
}

async function moveToPage(event) {

    console.log("tdtdt")

    let AskTR = document.querySelectorAll("#bit_ask > tr");

    bitMapAsk = new Map();
    bitMapBid = new Map();

    for await (const tr of AskTR) {
        tr.remove();
    }

    closeWS();

    let targetId = event.target.parentNode.id;
    targetId = targetId.replaceAll("_info", "");
    console.log("targetId", targetId)

    setCookie("page", "tradeView", "1")
    setCookie("order", targetId, "1")
    setCookie("payment", "KRW", "1")
    initPage();


}

const clickAsideCategory = (event) => {
    let target = event.target;

    if(target.id === "main-page" || target.parentNode.id === "main-page") {
        window.location.href = '/';
    } else if (target.id === "trade-page" || target.parentNode.id === "trade-page") {
        window.location.href = '/trade';
    }
}

   