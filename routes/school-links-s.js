var express = require('express');
var school_link_conv = require('../APIs/school_link_conv');
var router = express.Router();

router.get('/:name', function(req, res, next) {
  var param = req.params.name;
  if (param === "test") {
    res.end(req.params.name);
  } else {
    res.redirect("/");
  }
})

router.get('/get-full-name/:code', function(req, res, next) {
  var code = req.params.code;
  console.log(code);
  res.send(school_link_conv[code].name);
})

router.get('/get-code/:name', function(req, res, next) {
  var name = req.params.name;
  console.log(name);
  res.send(school_link_conv[name].code);
})


module.exports = router;
