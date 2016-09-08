var express = require('express');
var request = require('request');
var mongo = require('../database/mongo-db');
var TTI_API = require('../APIs/TTI_API');
var moltin = require('moltin')({
  publicId: process.env.MOLTIN_CLIENT_ID,
  secretKey: process.env.MOLTIN_SECRET
});
var router = express.Router();

// GET local API
router.get('/', function(req, res, next) {
  res.send("local api endpoint");
  mongo.mongoDBConnect(mongo.indigoTestURI)
  .then(function(data) {
    db.close(data.db);
  })
});

// GET ENV Variables
router.get('/env', function(req, res, next){
  var env = process.env;
  res.send(env);
})

// GET moltin product by 'slug'
router.get('/products/:slug', function(req, res, next) {
  moltin.Authenticate(function() {
    var product = moltin.Product.Find({slug: req.params.slug},
    function(product) {
      // console.log(product);
      res.send({
        product_title: product[0].title,
        product_description: product[0].description,
        product_price: product[0].price.value,
        product_img: product[0].images[0].url.https,
        product_id: product[0].id,
        product_slug: product[0].slug
      })
    },
    function(error){
      console.log(error);
    });
  });
});

// Retrieve fresh unassigned password by link, assign to user, and mark as assigned
router.get('/:link/passwords/assign-new', function(req, res, next) {
  mongo.mongoDBConnect(mongo.indigoTestURI)
  .then(function(data) {
    mongo.getAllPasswordsByLink(data.db, req.params.link)
    .then(function(respondentPasswords) {
      console.log('resondentPasswords', respondentPasswords);
      var unassignedPasswords = [];
      var passwordToAssign = "";
      for (var i = 0; i < respondentPasswords.length; i++) {
        if (respondentPasswords[i].assigned === false) {
          console.log('false');
          unassignedPasswords.push(respondentPasswords[i]);
        }
      }
      passwordToAssign = unassignedPasswords[0].password;
      console.log(passwordToAssign);
      mongo.assignPassword(data.db, req.params.link, passwordToAssign)
      .then(function(result){
        mongo.mongoDBDisconnect(data.db);
        res.send(result);
      })
    }).catch(function(err){
      console.log(err);
    })
  })
});

// POST to local API with TTI_API
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
