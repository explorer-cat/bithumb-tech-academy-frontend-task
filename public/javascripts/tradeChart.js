var dataPoints1 = [],
dataPoints2 = [],
dataPoints3 = [];
let realTimeFlag = false;

const tradeChart = (data) => {


     //   console.log("data", data.content.closePrice)
//        console.log("dataPoints1[dataPoints1.length]", dataPoints1[dataPoints1.length - 1])
        if(data) {
            realTimeFlag = true;
        } else {
            realTimeFlag = false;
        }

        if(!realTimeFlag) {

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
                startValue: 4000,
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
                risingColor: 'green',
                fallingColor: 'red',
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
      slider: {
        outlineInverted : false,
        minimum: new Date(2022, 02, 01),
        maximum: new Date(2022, 04, 20)
      }
    }

    });
    $.getJSON('https://api.bithumb.com/public/candlestick/BTC_KRW/24h',  function(data) {
        let result = data.data;
        for (var i = 0; i < result.length; i++) {
            dataPoints1.push({
                x: new Date(result[i][0]),
                y: [Number(result[i][1]), Number(result[i][3]), Number(result[i][4]), Number(result[i][2])],
                color: result[i][1] < result[i][2] ? 'green' : 'red',
            });
            ;
            dataPoints2.push({
                x: new Date(result[i][0]),
                y: Number(result[i][5]),
                color: result[i][1] < result[i][2] ? 'green' : 'red',
            });
            dataPoints3.push({x: new Date(result[i][0]), y: Number(result[i][1])});
        }
    });
    stockChart.render();

} else {

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
                startValue: 4000,
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
                risingColor: 'green',
                fallingColor: 'red',
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
      slider: {
        outlineInverted : false,
        minimum: new Date(2022, 02, 01),
        maximum: new Date(2022, 04, 20)
      }
    }

    });

    dataPoints1[dataPoints1.length -1] = ({
        x: new Date(),
        y: [Number(data.content.openPrice), Number(data.content.highPrice), Number(data.content.lowPrice), Number(data.content.closePrice)],
        color: Number(data.content.openPrice) < Number(data.content.highPrice) ? 'green' : 'red',
    });
    console.log("stockChart.options.navigator.slider.minimum", stockChart.options.navigator.slider.minimum)
    console.log("stockChart.options.navigator.slider.minimum", stockChart.options.navigator.slider.maximum)
    //stockChart.options.navigator.slider.minimum = new Date(xVal - (90 * 1000));


    console.log("stockChart", stockChart)
    stockChart.render();
}



        // setInterval(function(){
        //     let data = realTimeCandle()
        //     console.log("data",data)
        // }, 1000); //1초에 한번씩 업데이트
        

}


