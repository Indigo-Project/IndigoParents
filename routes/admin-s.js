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

router.post('/add-passwords', function(req, res, next) {

})

router.post('/add-generated-link', function(req, res, next) {
  console.log('linkInfo', req.body.linkInfo);
  mongo.mongoDBConnect(mongo.indigoParentsURI)
  .then(function(db) {
    mongo.addGeneratedLink(db.db, req.body.linkInfo)
    .then(function(result) {
      console.log('result', result);
      res.send(result)
    }).catch(function(err) {
      console.log(err);
    })
  }).catch(function(err) {
    console.log(err);
  })

})

router.post('/get-school-link-list', function(req, res, next) {
  console.log('schoolCode', req.body.schoolCode);
  mongo.mongoDBConnect(mongo.indigoParentsURI)
  .then(function(db) {
    mongo.getSchoolLinkList(db.db, req.body.schoolCode)
    .then(function(listLinks) {
      console.log('listLinks', listLinks);
      res.send(listLinks);
    }).catch(function(err) {
      console.log(err);
    })
  }).catch(function(err) {
    console.log(err);
  })

})

module.exports = router;
