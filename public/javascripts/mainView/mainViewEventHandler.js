const clickCategoryTab = (event) => {

    /* 카테고리 탭을 클릭 할 경우*/
    let target = event.target
    let table = document.getElementById("crypto_list_table");
    let select = document.querySelector(".tab_selected")

    //즐겨찾기를 클릭함.
    if(target.id === "favorite_crpyto") {
        if(target.classList.contains("tab_selected")) {
            return;
        }
        select.classList.remove("tab_selected");
        target.classList.add("tab_selected");

        let favoriteList = table.querySelectorAll("tbody > tr > td:nth-child(1)");
        console.log(favoriteList)
        for (const data of favoriteList) {
            if(!data.classList.contains("star_full")) {
                data.parentNode.classList.add("display_none")
            }
        }
        
    } else {
        // 원화 마켓을 클릭함.
        console.log("else")
        select.classList.remove("tab_selected");
        target.classList.add("tab_selected");

        let allList = table.querySelectorAll("tbody > tr");
        for (const data of allList) {
            if(data.classList.contains("display_none")) {
                data.classList.remove("display_none")
            }
        }

    }

    
}
