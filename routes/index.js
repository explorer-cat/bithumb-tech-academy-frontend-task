var express = require('express');
var router = express.Router();
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('tradeView', { title: 'Express' });
});


/* GET home page. */
router.get('/main', function(req, res, next) {
  res.render('mainView', { title: '빗썸!' });
});

router.post('/api/orderbook', async function(req, res, next) {
  try {
    let {order,payment} = req.body
    let result = await axios.request({ method: 'GET', url: `https://api.bithumb.com/public/orderbook/${order}_${payment}`, headers: {'Content-Type': 'application/json'} });
    res.send(result.data);
  } catch(e) {

  }
})


router.post('/api/ticker', async function(req, res, next) {
  try {
    let {order,payment} = req.body
    let result = await axios.request({ method: 'GET', url: `https://api.bithumb.com/public/ticker/${order}_${payment}`, headers: {'Content-Type': 'application/json'} });
    res.send(result.data);
  } catch(e) {

  }
})


router.post('/api/transaction', async function(req, res, next) {
  try {
    let {order,payment} = req.body
    let result = await axios.request({ method: 'GET', url: `https://api.bithumb.com/public/transaction_history/${order}_${payment}`, headers: {'Content-Type': 'application/json'} });
    res.send(result.data);
  } catch(e) {

  }
})



router.post('/api/candlestick', async function(req, res, next) {
  try {
    let {order,payment} = req.body//${order}
    let result = await axios.request({ method: 'GET', url: `https://api.bithumb.com/public/candlestick/["BTC_KRW"]/10m`, headers: {'Content-Type': 'application/json'} });
    res.send(result.data);
  } catch(e) {

  }
})


module.exports = router;
