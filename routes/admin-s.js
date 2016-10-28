var express = require('express');
var request = require('request');
var mongo = require('../database/mongo-db');
var TTI_API = require('../APIs/TTI_API');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log('admin server-side');
  res.send('admin server-side')
})

router.post('/login', function(req, res, next) {
  if (req.body.password === "Liveyourgenius7") {
    res.end('valid');
  } else {
    res.end('invalid');
  }
})

router.post('/add-uapw', function(req, res, next) {

})

module.exports = router;
