var express = require('express');
var request = require('request');
var mongo = require('../database/mongo-db');
var TTI_API = require('../APIs/TTI_API');
var moltin = require('moltin')({
  publicId: process.env.MOLTIN_CLIENT_ID,
  secretKey: process.env.MOLTIN_SECRET
});
var csv = require('csv');
var router = express.Router();
var bPromise = require('bluebird');


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
  var env = process.env.NODE_ENV;
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

// ** ADD PASSWORDS TO MLABS DB BY SCHOOLCODE **
router.post('/add-passwords', function(req, res, next) {

  mongo.mongoDBConnect(mongo.indigoParentsURI).
  then(function(data) {
    var db = data.db
    mongo.getAllPasswordsByLink(db, req.body.schoolCode, req.body.linkID)
    .then(function(data) {

      csv.parse(req.body.csv, {columns: true}, function(err, output) {

        var count = 0;
        for (var i = 0; i < output.length; i++) {
          var outputPassword = output[i].Password.substring(10);
          var addToDBObj = {};
          var addBool = true;
          if(output[i]['First Name'] === '' && output[i]['Last Name'] === '' && output[i][' E-mail'] === '') {
            if (data.length) {
              for (var j = 0; j < data.length; j++) {
                if (data[j].password === outputPassword) {
                  var addBool = false;
                  break;
                }
              }
              if(addBool === true) {
                addToDBObj.password = outputPassword;
                addToDBObj.link = req.body.schoolCode;
                addToDBObj.assigned = false;
                addToDBObj.first_name = "";
                addToDBObj.last_name= "";
                addToDBObj.email = "";
                mongo.addPassword(db, req.body.schoolCode, req.body.linkID, addToDBObj)
                count ++;
              }
            } else {
              addToDBObj.password = outputPassword;
              addToDBObj.link = req.body.schoolCode;
              addToDBObj.assigned = false;
              addToDBObj.first_name = "";
              addToDBObj.last_name= "";
              addToDBObj.email = "";
              mongo.addPassword(db, req.body.schoolCode, req.body.linkID, addToDBObj)
              count ++;
            }
          }
        }
        res.send({ count: count });
      })
    })
  })
})

router.post('/get-all-tti-links-for-school', function(req, res, next) {

  console.log(req.body.schoolCode);

  mongo.mongoDBConnect(mongo.indigoParentsURI)
  .then(function(data) {
    mongo.getAllTTILinksForSchool(data.db, req.body.schoolCode)
    .then(function(links) {
      console.log(links);
      res.send(links);
    }).catch(function(err) {
      console.log(err);
    })
  })

})

// Retrieve fresh unassigned password by link, assign to user, and mark as assigned
router.post('/assign-new-password', function(req, res, next) {

  var schoolCode = req.body.linkInstanceData.schoolCode;
  var linkIDs = {}
  linkIDs.parents = req.body.linkInstanceData.parents.TTIlinkID
  req.body.linkInstanceData.students ? linkIDs.students = req.body.linkInstanceData.students.TTIlinkID : null;
  var form = req.body.form;
  var cart = req.body.cart;

  // console.log('linkIDs', linkIDs);
  // console.log('form', form);
  // console.log('cart', cart);

  mongo.mongoDBConnect(mongo.indigoParentsURI)
  .then(function(data) {

    var parentOrderQuantity = cart.parentOrderQuantity;
    var studentOrderQuantity = cart.studentOrderQuantity || 0;

    var totalPasswordCount = parentOrderQuantity + studentOrderQuantity;

    function getPasswordsForOrder(role) {
      return new Promise(function(resolve, reject) {

        // console.log('------------------------------');
        // console.log('------------------------------');

        var linkID = linkIDs[role];
        var orderQuantity = role === 'parents' ? parentOrderQuantity : studentOrderQuantity;
        var currentPasswordsAssignedCount = 0;
        var passwordArr = [];

        console.log(role, linkID, orderQuantity, passwordArr);

          mongo.getAllPasswordsByLink(data.db, schoolCode, linkID)
          .then(function(passwords) {


            var passwordsToAssign = [];
            var unassignedPasswordExists = false;

            var assignmentCount = 0;

            for (var i = 0; i < orderQuantity; i++) {
              for (var j = 0; j < passwords.length; j++) {
                if (!passwords[j].assigned) {
                  // console.log('false');
                  unassignedPasswordExists = true;
                  passwordsToAssign.push([passwords[j + assignmentCount].password, j + assignmentCount]);
                  assignmentCount ++;
                  break;
                  }
              }
            }

            // console.log(role, passwordsToAssign);
            // console.log(role, unassignedPasswordExists);

            if(!unassignedPasswordExists) {
              res.end("all passwords for this link have been assigned - generate new passwords")
            } else {

              console.log(passwordsToAssign);
              bPromise.each(passwordsToAssign, function(element, i, length) {

                var mLabsData = {
                  pw: element[0],
                  first_name: form.firstName,
                  last_name: form.lastName,
                  email: form.email
                }

                mongo.assignPassword(data.db, schoolCode, linkID, mLabsData)
                .then(function(result){
                  // mongo.mongoDBDisconnect(data.db);
                  // console.log(role + 'assignPassword result:', result);
                  passwordArr.push(result.password);
                  currentPasswordsAssignedCount ++;

                  console.log("----------------------");
                  // console.log(passwordArr);
                  console.log(currentPasswordsAssignedCount, orderQuantity);
                  console.log("----------------------");

                  if (currentPasswordsAssignedCount === orderQuantity) {
                    console.log('resolve(passwordArr)', passwordArr);
                    resolve(passwordArr);
                  }

                })
              })

            }

          }).catch(function(err){
            console.log(err);
          })

      });
    }

    var assignedPasswords = {};
    var returnObj = {};

    getPasswordsForOrder('parents')
    .then(function(data) {
      console.log('after parents', data);
      assignedPasswords.parents = data;

      if (studentOrderQuantity) {

        getPasswordsForOrder('students')
        .then(function(data) {
          console.log('after students', data);
          assignedPasswords.students = data;


          console.log(assignedPasswords);
          res.send(assignedPasswords)

        }).catch(function(err){
          console.log(err);
        })

      } else {
        res.send(assignedPasswords)
      }

    }).catch(function(err){
      console.log(err);
    })

  }).catch(function(err){
    console.log(err);
  });

});

// *** TTI ***

// GET TTI LINK DATA BASED ON ADMIN PORTAL SCHOOL SELECTION
router.post('/show-link', function(req, res, next) {
  // var selectedSchool = req.params.link;
  mongo.mongoDBConnect(mongo.indigoParentsURI).
  then(function(data) {
    var db = data.db
    mongo.getAllPasswordsByLink(db, req.body.selectedSchool, req.body.linkID)
    .then(function(data) {
      console.log('getAllPasswordsByLink data:', data);
      var unassignedCount = 0;
      for (var i = 0; i < data.length; i++) {
        !data[i].assigned ? unassignedCount += 1 : null;
      }
      res.send({data: data, unassignedCount: unassignedCount});

  // ** ACCESS VIA TTI API
  // var ssRef = TTI_API.linkLocations[selectedSchool];
  // var options = {
  //   url: TTI_API.APIs.showLink.generateEndpoint(ssRef.accountID, ssRef.mainLink.id),
  //   headers: {
  //     'Authorization': 'Basic c2hlcmlzbWl0aDpJbmRpZ29GciMj',
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //   }
  // };
  // request(options, function(err, response, body) {
  //   if (err) {
  //     console.log(err);
  //     res.end();
  //   } else {
  //     res.end(body);
  //   }
  // })

    })
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
      console.log(httpResponse.headers.status);
      console.log('response body', body);
      var returnObj = { body: body, status: httpResponse.headers.status };
      res.send(returnObj);
    }
  })
})

module.exports = router;
