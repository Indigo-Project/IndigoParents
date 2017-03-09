var express = require('express');
var request = require('request');
var mongo = require('../database/mongo-db');
var TTI_API = require('../APIs/TTI_API');

var env = process.env.NODE_ENV
var stripeSecret;
if (env === 'DEVELOPMENT') {
  stripeSecret = process.env.STRIPE_TEST_SECRET
} else {
  stripeSecret = process.env.STRIPE_LIVE_SECRET;
}
console.log(stripeSecret);
var stripe = require('stripe')(stripeSecret);
var router = express.Router();

router.post('/submit-purchase', function(req, res ,next) {

  // console.log(req.body);
  var cart = req.body.cart;
  var token = req.body.token;

  function calcAmount(cart) {
    var parentAmount = Number(cart.parentOrderQuantity) * Number(cart.parentsProductPrice);
    var studentAmount = cart.studentOrderQuantity ? Number(cart.studentOrderQuantity) * Number(cart.studentsProductPrice) : 0;

    console.log(parentAmount, studentAmount);

    return Number(parentAmount + studentAmount) * 100;

  }

  var amount = calcAmount(cart);
  console.log(amount);
  console.log(token);

  var charge = stripe.charges.create({
    amount: amount,
    currency: "usd",
    description: "Test Indigo Parents Charge",
    source: token.id
  }, function(err, charge) {
    if (err) {
      console.log('charge error', err);
      res.send({status: 'charge error', errorMessage: err.message})
    } else {
      console.log('charge success', charge);
      res.send({status: 'charge success', charge: charge})
    }
  });

})

module.exports = router;
