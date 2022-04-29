function getTradeMiniChart(id,data) {
  let time = []
  let priceData = []
  console.log("data.length",data)

  //그래프의 min max 를 구하기위해 최근 200분가 최저가와 최고가를 찾아야함.

  //시간과 거래량을 잘라낸 가격만 있는 순수 오브젝트
  let slicePriceData = []

  //기본적으로 첫번째 들어오는 값을 기본으로 세팅하고 반복돌면서 최저 최고값 찾을수있게.
  let min  = Number(data[0][4]);
  let max  = Number(data[0][3]);;

  for(let i = 0; i < data.length; i++) {
    time.push(new Date(data[i][0]).toLocaleTimeString())
    priceData.push(Number(data[i][2]))

    //최저가와 최저가를 찾아보자
    if(min > Math.min.apply(null, data[i].slice(1,4))) {
      min = Math.min.apply(null, data[i].slice(1,4))
    }


    if(max < Math.max.apply(null, data[i].slice(1,4))) {
      max = Math.max.apply(null, data[i].slice(1,4))
    }
  }

  // Now create the chart
  Highcharts.chart(id, {
    exporting: {
        enabled: false
      },

    chart: {
      type: 'area',
      zoomType: 'x',
      panning: true,
      panKey: 'shift',
      margin: [0, 0, 0, 0],
      scrollablePlotArea: {
        minWidth: 10
      }
    },

    title: {
      text: ''
    },

    credits: {
      enabled: false
    },

    xAxis: {
      categories: time,
      //tickPositions: [0,1,2,3,4,5,6,7],
      visible: false,
    },


    yAxis: {
      min : min,
      max : max,
      startOnTick: true,
      endOnTick: true,
      // maxPadding: 0.35,
      title: {
        text: null
      },
      labels: {
        format: '{value} m'
      },
      visible:false
    },

    legend: {
      enabled: false
    },

    tooltip: {

      formatter: function() {;
          return `<b>${this.x}</b><br>${numberToKorean(this.y)}원`
      },
      shared: true
  },
    series: [{
      data: priceData,
      lineColor: "#5580F6",
      color: "#003EE9",
      fillOpacity: 0.2,
      name: '종가',
    }]

  });

}

function getMainMiniChart(id,data) {
  let time = []
  let priceData = []

  //그래프의 min max 를 구하기위해 최근 200분가 최저가와 최고가를 찾아야함.

  //시간과 거래량을 잘라낸 가격만 있는 순수 오브젝트
  let slicePriceData = []


  //기본적으로 첫번째 들어오는 값을 기본으로 세팅하고 반복돌면서 최저 최고값 찾을수있게.
  let min  = Number(data[0][4]);
  let max  = Number(data[0][3]);;

  for(let i = 0; i < data.length; i++) {
    time.push(new Date(data[i][0]).toLocaleTimeString())
    priceData.push(Number(data[i][2]))

    //최저가와 최저가를 찾아보자
    if(min > Math.min.apply(null, data[i].slice(1,4))) {
      min = Math.min.apply(null, data[i].slice(1,4))
    }


    if(max < Math.max.apply(null, data[i].slice(1,4))) {
      max = Math.max.apply(null, data[i].slice(1,4))
    }
  }

  // Now create the chart
  Highcharts.chart(id, {
    exporting: {
      enabled: false
    },

    chart: {
      type: 'area',
      zoomType: 'x',
      panning: true,
      panKey: 'shift',
      margin: [0, 0, 0, 0],
      scrollablePlotArea: {
        minWidth: 10
      }
    },

    title: {
      text: ''
    },

    credits: {
      enabled: false
    },

    xAxis: {
      categories: time,
      //tickPositions: [0,1,2,3,4,5,6,7],
      visible: false,
    },


    yAxis: {
      min : min,
      max : max,
      startOnTick: true,
      endOnTick: true,
      // maxPadding: 0.35,
      title: {
        text: null
      },
      labels: {
        format: '{value} m'
      },
      visible:false
    },

    legend: {
      enabled: false
    },

    tooltip: {
      enabled : false,
      formatter: function() {;
        return `<b>${this.x}</b><br>${numberToKorean(this.y)}원`
      },
      shared: true
    },
    series: [{
      data: priceData,
      lineColor: "#C0C0C0",
      color: "#E0E0E0",
      fillOpacity: 0.2,
      name: '종가',
    }]

  });

}



function getTableMiniChart(id,data,dd) {
  let time = []
  let priceData = []

  let status = document.querySelector(`#${id}`)
  let color

  if(status.parentNode.querySelector(".up_red_color")) {
    color = "#d60000"
  } else {
    color = "#0051c7"
  }


  //그래프의 min max 를 구하기위해 최근 200분가 최저가와 최고가를 찾아야함.

  //시간과 거래량을 잘라낸 가격만 있는 순수 오브젝트
  let slicePriceData = []

  //기본적으로 첫번째 들어오는 값을 기본으로 세팅하고 반복돌면서 최저 최고값 찾을수있게.
  let min  = Number(data[0][4]);
  let max  = Number(data[0][3]);;

  for(let i = 0; i < data.length; i++) {
    time.push(new Date(data[i][0]).toLocaleTimeString())
    priceData.push(Number(data[i][2]))

    //최저가와 최저가를 찾아보자
    if(min > Math.min.apply(null, data[i].slice(1,4))) {
      min = Math.min.apply(null, data[i].slice(1,4))
    }


    if(max < Math.max.apply(null, data[i].slice(1,4))) {
      max = Math.max.apply(null, data[i].slice(1,4))
    }
  }

  // Now create the chart
  Highcharts.chart(id, {
    exporting: {
      enabled: false
    },

    chart: {
      type: 'area',
      zoomType: 'x',


      panning: true,
      panKey: 'shift',
      margin: [0, 0, 0, 0],
      scrollablePlotArea: {
        minWidth: 10
      }
    },

    title: {
      text: ''
    },

    credits: {
      enabled: false
    },

    xAxis: {
      categories: time,
      //tickPositions: [0,1,2,3,4,5,6,7],
      visible: false,
    },


    yAxis: {
      min : min,
      max : max,
      startOnTick: false,
      endOnTick: false,
      // maxPadding: 0.35,
      title: {
        text: null
      },
      labels: {
        format: '{value} m'
      },
      visible:false
    },

    legend: {
      enabled: false
    },

    tooltip: {
      enabled : false,
      formatter: function() {;
        return `<b>${this.x}</b><br>${numberToKorean(this.y)}원`
      },
      shared: false
    },
    series: [{
      data: priceData,
      lineColor: color,
      color: "#FFFFFF",
      fillOpacity: 0,
      name: '종가',
    }]

  });

}