var dataPoints1 = [],
dataPoints2 = [],
dataPoints3 = [];
let realTimeFlag = false;
let TimeTemp;

        //현재시간
        let minTime = new Date().getTime();
        //1분봉 표시 미니멈 시간
        let maxTime = new Date().getTime();

const tradeChart = () => {
    var stockChart = new CanvasJS.StockChart('chartContainer', {
        exportEnabled: false,
        theme: 'light2',
        dataPointMaxWidth: 2222,
        backgroundColor: "#fafbfe",
        animationEnabled: false,
        zoomEnabled:true,
        title: {
            text: '',
            enabled : false
        },
        rangeSelector: {
            enabled : false,
            verticalAlign : "bottom",
            inputFields: {
                enabled : false,
                startValue: 7000,
                endValue: 6000,
                valueFormatString: '###0',
            },
            /*1일 봉 차트 클릭시 30일 기준 1일봉 차트를 보여줌*/
            buttons: [
            	{
            		label: '1일',
            		range: 30,
            		rangeType: 'day',
            	},
                {
            		label: '1주',
            		range: 60,
            		rangeType: 'week',
            	},
                {
            		label: '1달',
            		range: 360,
            		rangeType: 'month',
            	},
            ],
        },
        charts: [{
            toolTip: {
                shared: true,
            },
            axisX: {
                lineThickness: 5,
                tickLength: 0,
                labelFormatter: function(e) {
                    return '';
                },
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true,
                    labelFormatter: function(e) {
                        return '';
                    },
                },
            },
            axisY2: {
                title: '',
                prefix: '',
            },
            legend: {
                verticalAlign: 'top',
                horizontalAlign: 'left',
            },
            data: [{
                name: '원화 가격',
                yValueFormatString: '#,###.##',
                axisYType: 'secondary',
                type: 'candlestick',
                risingColor: 'red',
                fallingColor: 'blue',
                dataPoints: dataPoints1,
            }],
        }, {
            height: 100,
            toolTip: {
                shared: true,
            },
            // axisX: {
            //     crosshair: {
            //         enabled: false,
            //         snapToDataPoint: false,
            //     },
            // },
            axisY2: {
                // prefix: "BTC",
                title: 'BTC/KRW',
            },
            legend: {
                horizontalAlign: 'left',
            },
            data: [{
                yValueFormatString: '#,###.##',
                axisYType: 'secondary',
                name: 'BTC/KRW',
                dataPoints: dataPoints2,
            }],
        }],

    navigator: {
      animationEnabled: false, //Change it to false,
      dynamicUpdate: true,
      slider: {
        outlineInverted : false,
        minimum: minTime - 5000000,
        maximum: maxTime
        // minimum: new Date(1650001200000),
        // maximum: new Date(1650090000000)
      }
    }

    });
    console.log("stockChart", new Date(2022, 04, 16, 11, 30))
    $.getJSON('https://api.bithumb.com/public/candlestick/BTC_KRW/1m',  function(data) {
        let result = data.data;

        console.log("result",result)
        for (var i = 0; i < result.length; i++) {

            dataPoints1.push({
                x: new Date(result[i][0]),
                y: [Number(result[i][1]), Number(result[i][3]), Number(result[i][4]), Number(result[i][2])],
                color: result[i][1] < result[i][2] ? 'red' : 'blue',
            });

            dataPoints2.push({
                x: new Date(result[i][0]),
                y: Number(result[i][5]),
                color: result[i][1] < result[i][2] ? 'red' : 'blue',
            });
            dataPoints3.push({x: new Date(result[i][0]), y: Number(result[i][1])});

            if(i === result.length - 1) {
                console.log("new Date(result[i][1])", new Date(result[i][0]))
                TimeTemp = new Date(result[i][0])
            }



        }

        console.log("TimeTemp", TimeTemp)
        stockChart.render();
    });



     setInterval(async function(){
         await addData();
         await stockChart.render()
        }, 60000);
} 


const addData = () => {
    $.getJSON('https://api.bithumb.com/public/candlestick/BTC_KRW/1m',  function(data) {

        let result = data.data[data.data.length - 1];
        if(new Date(result[0]).getDate() === new Date(TimeTemp).getDate()) {
 
        } else {
            dataPoints1.push({
                x: new Date(result[0]),
                y: [Number(result[1]), Number(result[3]), Number(result[4]), Number(result[2])],
                color: result[1] < result[2] ? 'red' : 'blue',
            });
    
            dataPoints2.push({
                x: new Date(result[0]),
                y: Number(result[5]),
                color: result[1] < result[2] ? 'red' : 'blue',
            });
    
            dataPoints3.push({x: new Date(result[0]), y: Number(result[1])});
            console.log("puash!!",dataPoints1)
        }
    });
}



