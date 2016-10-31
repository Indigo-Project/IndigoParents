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
    console.log(data.message);
    db.close(data.db);
  })
});

// GET ENV Variables
router.get('/env', function(req, res, next){
  var env = process.env;
  res.send(env);
})

// *** MOLTIN ***

// GET moltin product by 'SLUG' (this is what appears on product page)
router.get('/products/:slug', function(req, res, next) {
  moltin.Authenticate(function() {
    var product = moltin.Product.Find({slug: req.params.slug},
    function(product) {
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

// Add Product to moltin Cart (server-side checkout flow)
router.post('/products/atc/indigo-inventory', function(req, res, next) {
  console.log(req.body);
  var quantity = req.body.quantity;
  moltin.Authenticate(function() {
    // moltin.Cart.Insert('1334169416354496686', req.body.qty, null, function(cart) {
    //   console.log(cart);
    // }, function(error) {
    //     // Something went wrong...
    // });
  });
})

// Retrieve Moltin Checkout Options (server-side checkout flow)
router.post('/checkoutinfo', function(req, res, next) {
  var cart = req.body.cart;
  var iCartId = req.body.cartId;
  var oCartId = cart[0][iCartId].id;
  moltin.Authenticate(function(d) {
    moltin.Cart.Contents(function(items) {
    console.log(items);
    }, function(error) {
    // Something went wrong...
    });
    // moltin.Cart.Checkout(function(checkout) {
    //   console.log(checkout);
    // }, function(error) {
    //   console.log(error);
    // });
    // var options = {
    //   method: 'GET',
    //   url: "https://api.molt.in/v1/carts/oCartId/checkout",
    //   auth: { bearer: d.access_token }
    // }
    // request(options, function(err, httpResponse, body) {
    //   console.log(body);
    // })
  })
})

// ** TEMP : ACCESS PASSWORDS THROUGH MLABS DB **

router.get('/:link/passwords', function(req, res, next) {
  mongo.mongoDBConnect(mongo.indigoTestURI).
  then(function(data) {
    mongo.getAllPasswordsByLink(data.db, req.params.link)
    .then(function(linkPasswords) {
      res.send({ link_id: req.params.link, passwords: linkPasswords });
    })
  })
})

// Retrieve fresh unassigned password by link, assign to user, and mark as assigned
router.get('/:link/passwords/assign-new', function(req, res, next) {
  mongo.mongoDBConnect(mongo.indigoTestURI)
  .then(function(data) {
    mongo.getAllPasswordsByLink(data.db, req.params.link)
    .then(function(linkPasswords) {
      console.log('resondentPasswords', linkPasswords);
      var passwordToAssign = "";
      var indexOfPasswordToAssign = "";
      var unassignedPasswordExists = false;
      for (var i = 0; i < linkPasswords.length; i++) {
        if (linkPasswords[i].assigned === false) {
          console.log('false');
          unassignedPasswordExists = true;
          passwordToAssign = linkPasswords[i].password;
          indexOfPasswordToAssign = i;
          break;
        }
      }
      console.log(indexOfPasswordToAssign);
      console.log(passwordToAssign);
      if(!unassignedPasswordExists) {
        res.end("all passwords for this link have been assigned - generate new passwords")
      }
      mongo.assignPassword(data.db, req.params.link, passwordToAssign)
      .then(function(result){
        mongo.mongoDBDisconnect(data.db);
        res.send(result);
      }).catch(function(err){
        console.log(err);
      })
    }).catch(function(err){
      console.log(err);
    })
  }).catch(function(err){
    console.log(err);
  });
});

// *** TTI ***

// GET TTI LINK DATA BASED ON ADMIN PORTAL SCHOOL SELECTION
router.post('/showLink', function(req, res, next) {
  var selectedSchool = req.body.selectedSchool;
  var ssRef = TTI_API.linkLocations[selectedSchool];
  var options = {
    url: TTI_API.APIs.showLink.generateEndpoint(ssRef.accountID, ssRef.mainLink.id),
    headers: {
      'Authorization': 'Basic c2hlcmlzbWl0aDpJbmRpZ29GciMj',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  };
  request(options, function(err, response, body) {
    if (err) {
      console.log(err);
      res.end();
    } else {
      res.end(body);
    }
  })
})

// POST to local API with TTI_API
router.post('/create-respondent', function(req, res, next) {
  var accountID = TTI_API.linkLocations[req.body.school].accountID;
  var linkID = TTI_API.linkLocations[req.body.school].mainLink.id;
  var respondentData = req.body.data;
  var options = {
    method: "POST",
    url: TTI_API.APIs.createRespondent.generateEndpoint(accountID, linkID),
    headers: {
      'Authorization': 'Basic ' + TTI_API.linkLocations[req.body.school].auth,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    json: true,
    body: respondentData
  };
  request(options, function(err, httpResponse, body){
    if (err) {
      console.log("--- POST REQUEST ERROR ---", err);
    } else {
      console.log(httpResponse.headers.location);
      console.log('response body', body);
      res.send(body);
    }
  })
})

module.exports = router;
