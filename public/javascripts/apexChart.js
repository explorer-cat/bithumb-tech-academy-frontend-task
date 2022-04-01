     function makeBTCChart(chartData) {
         if(document.querySelector("#chart")){
            document.querySelector("#chart").remove();
         }
         let target = document.querySelector(".btc_chart");
         console.log("target", target)

         let chartjs = document.createElement("div");
         chartjs.id = "chart";
         chartjs.style.width = "100%";

         target.appendChild(chartjs);

        var options = {
            series: [{
            data: [{
                x: new Date(1538778600000),
                //open high low close
                y: [chartData.open, chartData.high, chartData.low, chartData.close]
              },
              
            ]
          }],
            chart: {
            type: 'candlestick',
            align: 'left',
            window: 30,
            height: 200,
            animations: {
                enabled: false,
                easing: 'easeinout',
            }
          },
          title: {
            text: chartData.name,
            align: 'left'
          },
          xaxis: {
            type: 'datetime',
            align: 'left'
          },
          plotOptions: {
            bar: {
                columnWidth: '10%'
            },
            candlestick: {
                colors: {
                  upward: '#D1233A',
                  downward: '#4684EF'
                }
              }
            
          },
          yaxis: {
            tooltip: {
              enabled: true
            },

          }
          };
          var chart = new ApexCharts(document.querySelector("#chart"), options);
          chart.render();
     }

     function makeETHChart(chartData) {
        if(document.querySelector("#chart")){
           document.querySelector("#chart").remove();
        }
        let target = document.querySelector(".eth_chart");
        console.log("target", target)

        let chartjs = document.createElement("div");
        chartjs.id = "chart";
        chartjs.style.width = "100%";

        target.appendChild(chartjs);

       var options = {
           series: [{
           data: [{
               x: new Date(1538778600000),
               //open high low close
               y: [chartData.open, chartData.high, chartData.low, chartData.close]
             },
             
           ]
         }],
           chart: {
           type: 'candlestick',
           align: 'left',
           window: 30,
           height: 200,
           animations: {
               enabled: false,
               easing: 'easeinout',
           }
         },
         title: {
           text: chartData.name,
           align: 'left'
         },
         xaxis: {
           type: 'datetime',
           align: 'left'
         },
         plotOptions: {
           bar: {
               columnWidth: '10%'
           },
           candlestick: {
               colors: {
                 upward: '#D1233A',
                 downward: '#4684EF'
               }
             }
           
         },
         yaxis: {
           tooltip: {
             enabled: true
           },

         }
         };
         var chart = new ApexCharts(document.querySelector("#chart"), options);
         chart.render();
    }

    function makeXRPChart(chartData) {
        if(document.querySelector("#chart")){
           document.querySelector("#chart").remove();
        }
        let target = document.querySelector(".xrp_chart");
        console.log("target", target)

        let chartjs = document.createElement("div");
        chartjs.id = "chart";
        chartjs.style.width = "100%";

        target.appendChild(chartjs);

       var options = {
           series: [{
           data: [{
               x: new Date(1538778600000),
               //open high low close
               y: [chartData.open, chartData.high, chartData.low, chartData.close]
             },
             
           ]
         }],
           chart: {
           type: 'candlestick',
           align: 'left',
           window: 30,
           height: 200,
           animations: {
               enabled: false,
               easing: 'easeinout',
           }
         },
         title: {
           text: chartData.name,
           align: 'left'
         },
         xaxis: {
           type: 'datetime',
           align: 'left'
         },
         plotOptions: {
           bar: {
               columnWidth: '10%'
           },
           candlestick: {
               colors: {
                 upward: '#D1233A',
                 downward: '#4684EF'
               }
             }
           
         },
         yaxis: {
           tooltip: {
             enabled: true
           },

         }
         };
         var chart = new ApexCharts(document.querySelector("#chart"), options);
         chart.render();
    }

    function makeBCHChart(chartData) {
        if(document.querySelector("#chart")){
           document.querySelector("#chart").remove();
        }
        let target = document.querySelector(".bch_chart");
        console.log("target", target)

        let chartjs = document.createElement("div");
        chartjs.id = "chart";
        chartjs.style.width = "100%";

        target.appendChild(chartjs);

       var options = {
           series: [{
           data: [{
               x: new Date(1538778600000),
               //open high low close
               y: [chartData.open, chartData.high, chartData.low, chartData.close]
             },
             
           ]
         }],
           chart: {
           type: 'candlestick',
           align: 'left',
           window: 30,
           height: 200,
           animations: {
               enabled: false,
               easing: 'easeinout',
           }
         },
         title: {
           text: chartData.name,
           align: 'left'
         },
         xaxis: {
           type: 'datetime',
           align: 'left'
         },
         plotOptions: {
           bar: {
               columnWidth: '10%'
           },
           candlestick: {
               colors: {
                 upward: '#D1233A',
                 downward: '#4684EF'
               }
             }
           
         },
         yaxis: {
           tooltip: {
             enabled: true
           },

         }
         };
         var chart = new ApexCharts(document.querySelector("#chart"), options);
         chart.render();
    }

    function makeMATICChart(chartData) {
        if(document.querySelector("#chart")){
           document.querySelector("#chart").remove();
        }
        let target = document.querySelector(".matic_chart");
        console.log("target", target)

        let chartjs = document.createElement("div");
        chartjs.id = "chart";
        chartjs.style.width = "100%";

        target.appendChild(chartjs);

       var options = {
           series: [{
           data: [{
               x: new Date(1538778600000),
               //open high low close
               y: [chartData.open, chartData.high, chartData.low, chartData.close]
             },
             
           ]
         }],
           chart: {
           type: 'candlestick',
           align: 'left',
           window: 30,
           height: 200,
           animations: {
               enabled: false,
               easing: 'easeinout',
           }
         },
         title: {
           text: chartData.name,
           align: 'left'
         },
         xaxis: {
           type: 'datetime',
           align: 'left'
         },
         plotOptions: {
           bar: {
               columnWidth: '10%'
           },
           candlestick: {
               colors: {
                 upward: '#D1233A',
                 downward: '#4684EF'
               }
             }
           
         },
         yaxis: {
           tooltip: {
             enabled: true
           },

         }
         };
         var chart = new ApexCharts(document.querySelector("#chart"), options);
         chart.render();
    }
