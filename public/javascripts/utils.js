const numberToKorean = (obj) =>{
    if(obj){
        const formatter = Intl.NumberFormat();
        if(obj > 99999999999) {
            var jo = String(obj).slice(0,-12);
            obj = (obj % 1000000000000);
            var eok = (obj / 100000000).toFixed(1);
            if(formatter.format(jo) === 0) {
                return formatter.format(jo) + '조 ' + formatter.format(eok) + '억';
            } else {
                return formatter.format(eok) + '억';    
            }
        } else if (obj > 99999999) {
            obj = (obj / 100000000).toFixed(0);
            return formatter.format(obj) + '억';
        } else {
            return formatter.format(obj);
        }
    } 
    return obj;
}