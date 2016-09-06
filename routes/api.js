var express = require('express');
var request = require('request');
var mongo = require('../database/mongo-db');
var TTI_API = require('../APIs/TTI_API');
var router = express.Router();

// GET local API
router.get('/', function(req, res, next) {
  res.send("local api endpoint");
  mongo.mongoDBConnect(mongo.indigoTestURI);
});

router.get('/:link/passwords/unassigned', function(req, res, next) {
  // res.send("local api endpoint");
  mongo.mongoDBConnect(mongo.indigoTestURI)
  .then(function(data) {
    mongo.getUnassignedPasswordsByLink(data.db, req.params.link)
    .then(function(data) {
      var unassignedPasswords = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].assigned === "false") {
          unassignedPasswords.push(data[i])
        }
      }
      res.send(unassignedPasswords[0].password);
    }).catch(function(err){
      console.log(err);
    })
    mongo.mongoDBDisconnect(data.db);
  })
});

// POST to local API
router.post('/createrespondent', function(req, res, next) {

  console.log("posted respondent data to local server /api: ", req.body);
  mongo.mongoDBConnect(mongo.indigoTestURI)
  .then(function(data) {
    // console.log(data.message);
    mongo.newRespondent(data.db, req.body)
    .then(function(data) {
      console.log(TTI_API.APIs.createRespondent.generateEndpoint(TTI_API.linkLocations.indigoParentsTest.accountID, TTI_API.linkLocations.indigoParentsTest.mainLink.id));
      console.log("req.body", req.body);

      var opts = {
        url: TTI_API.APIs.createRespondent.generateEndpoint(TTI_API.linkLocations.indigoParentsTest.accountID, TTI_API.linkLocations.indigoParentsTest.mainLink.id),
        headers: {
          'Authorization': 'Basic c2hlcmlzbWl0aDpJbmRpZ29GciMj',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        auth: { user: 'sherismith', password: 'IndigoFr##' },
        // json: true,
        form: req.body
        // formData: {
        //   first_name: 'paul',
        //   last_name: 'dziemianowicz',
        //   gender: 'M',
        //   email: 'pauldziemianowicz@gmail.com'
        // }
        // formData: {
        //   first_name: req.body.first_name,
        //   last_name: req.body.last_name,
        //   gender: req.body.gender,
        //   email: req.body.email
        // }
      };

      request(opts, function(err,httpResponse,body){
        if (err) {
          console.log("--- POST REQUEST ERROR ---", err);
        } else {
        console.log(httpResponse.headers.location);
        console.log('response body', body);
        }
      })

    })
    .catch(function(err) {
      console.log('ERROR ERROR', err);
    })
  })
  .catch(function(err) {
    console.log('ERROR ERROR', err);
  })
});

module.exports = router;
