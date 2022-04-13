var express = require('express');
var router = express.Router();
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
    let {order,payment} = req.body
    let result = await axios.request({ method: 'GET', url: `https://api.bithumb.com/public/candlestick/${order}_${payment}/10m`, headers: {'Content-Type': 'application/json'} });
    res.send(result.data);
  } catch(e) {

  }
})


module.exports = router;
