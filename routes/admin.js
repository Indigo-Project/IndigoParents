var express = require('express');
var request = require('request');
var mongo = require('../database/mongo-db');
var TTI_API = require('../APIs/TTI_API');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('admin portal');
})

module.exports = router;
