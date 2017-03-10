app.controller('Checkout_Controller', ['$scope', '$state', '$timeout', '$window','localStorageService', 'mLabs', 'Moltin_API', 'TTI_API', 'SG', 'StripeService', function($scope, $state, $timeout, $window, localStorageService, mLabs, Moltin_API, TTI_API, SG, StripeService) {

  $scope.view = {};
  $scope.data = {};
  $scope.form = {};
  $scope.view.paymentStatus = "";

  var stripeSecret, env, stripe, elements, card
  Moltin_API.getENV()
  .then(function(data) {
    env = data.data;
    if (env === 'DEVELOPMENT') {
      stripeSecret = 'pk_test_bBpUE70t4N2m4NUTxatiEtuH';
    } else if (env === 'PRODUCTION') {
      stripeSecret = 'pk_live_Jc8MsI8vrWaC0OTAeLPmXLWU';
    }
    console.log(stripeSecret);
    stripe = Stripe(stripeSecret);
    elements = stripe.elements();
    card = elements.create('card');
    card.mount('#card-element');

    $scope.data.cardError = '';
    card.addEventListener('change', function(event) {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        $scope.data.cardError = event.error;
        displayError.textContent = event.error.message;
      } else {
        $scope.data.cardError = '';
        displayError.textContent = '';
      }
    });

  });


  $scope.view.checkoutAccess = localStorageService.get('checkoutStatus') || null;
  // $scope.data.timer;

  if($scope.view.checkoutAccess === "post-checkout-off") {
    localStorageService.set('invQty', 0);
    $state.transitionTo("productsPage");
  } else if ($scope.view.checkoutAccess === "post-checkout-mid" && $state.current.name === 'checkoutMain') {
    // $timeout.cancel($scope.data.timer);
    localStorageService.set('invQty', 0);
    $state.transitionTo("productsPage");
  }

  $scope.view.leaveSite = function() {
    localStorageService.set('checkoutStatus', 'post-checkout-off')
    var location = localStorageService.get('linkInstanceData').schoolCode;
    if (location === 'arete') {
      $window.location.href = "http://www.indigoproject.org/arete"
    } else {
      $window.location.href = "http://www.indigoproject.org/parent-night";
    }
  }

  $scope.data.lscart = localStorageService.get('cart') || [];

  // ***** SPRINT 3 *****
  $scope.cart = localStorageService.get('shoppingCart');

  // var cartKey = Object.keys(localStorageService.get('cart')['0'])[0];
  // $scope.data.cart = $scope.data.lscart[0][cartKey];
  // console.log($scope.data.cart);

  // if (localStorageService.get('cart') !== null) {
  //   var cartKey = Object.keys(localStorageService.get('cart')['0'])[0];
  //   $scope.data.cartKey = Object.keys(localStorageService.get('cart')['0'])[0];
  // } else {
  //   var cartKey = null;
  //   $scope.data.cartKey = null;
  // }
  // console.log($scope.data.cartKey);

  // if no cartKey, $scope.data.cart = null, otherwise = localStorage Cart Object
  // if(cartKey === null) {
  //   $scope.data.cart = [];
  //   var iiCartItem = null;
  // } else {
  //   $scope.data.cart = localStorageService.get('cart')['0'][cartKey];
  //   var iiCartItem = $scope.data.cart;
  // }

  // if iiCartItem totalCartQty = quantity of cart Item, otherwise = 0;
  // if (iiCartItem) {
  //   $scope.data.totalCartQty = iiCartItem.quantity
  // } else {
  //   $scope.data.totalCartQty = 0;
  // }

  // if ($scope.data.totalCartQty < 1 && $scope.data.checkoutAccess !== "post-checkout") {
  //   $state.transitionTo('productsPage');
  // }

  // update view.cartEmpty based on totalCart Qty
  $scope.data.updateCartStatus = function() {
    if ($scope.data.totalCartQty > 0) {
      $scope.view.cartEmpty = false;
    } else {
      $scope.view.cartEmpty = true;
    }
  }

  $scope.data.calcTotalCartQty = function() {
    if (cartKey === null || cartKey === undefined) {
      $scope.data.totalCartQty = 0;
    } else {
      // console.log($scope.data.cart[0]);
      // console.log($scope.data.cart['0']);
      // console.log(cartKey);
      $scope.data.totalCartQty = $scope.data.cart[0][cartKey].quantity || 0;
    }
    $scope.data.updateCartStatus();
  }

  // empty cart for checkout success logic
  $scope.data.emptyCart = function() {
    Moltin_API.getENV()
    .then(function(env) {
      var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
      moltin.Authenticate(function() {
        // var cartID =
        moltin.Cart.Remove(cartKey, function() {
          var cart = moltin.Cart.Contents();
          var cartContents = [];
          cartContents.push(cart.contents);
          localStorageService.set("cart", cartContents);
          $scope.data.cart = localStorageService.get("cart");
          $scope.data.totalCartQty = 0;
          if (localStorageService.get('cart') !== null) {
            var cartKey = Object.keys(localStorageService.get('cart')['0'])[0]
          } else {
            var cartKey = null;
          }
          $scope.data.totalCartQty = 0;
          $scope.data.updateCartStatus();
          $scope.$apply();
          $state.reload();
        },
        function(error) {
          console.log(error);
        });
      })
    }).catch(function(error) {
      console.log(error);
    })
  }


  // run updateCartStatus on controller instantiation
  $scope.data.updateCartStatus();

  $scope.data.purchaseSubmission = function() {

    // var card = elements.create('card');

    $scope.view.processingPayment = "processing";
    console.log($scope.form);
    console.log($scope.cart);
    console.log(localStorageService.get('shoppingCart'));

    console.log(card);
    console.log($scope.data.cardError);

    var form = $scope.form;
    var cart = $scope.cart;
    var linkInstanceData = localStorageService.get('linkInstanceData');
    var schoolCode = linkInstanceData.schoolCode;

    if ($scope.data.cardError) {
      alert('Payment Method Error');
    } else {
      stripe.createToken(card, {name: $scope.form.firstName + ' ' + $scope.form.lastName, currency: 'usd'}).then(function(result) {
        if (result.error) {
          console.log(error);
        } else {
          StripeService.submitPurchase(result.token, form, cart, linkInstanceData)
          .then(function(data) {
            if (data.data.status === 'charge error') {
              $scope.view.processingPayment = '';
              alert(data.data.errorMessage + ' - Please Try Again.');
              $scope.$apply();
            } else if (data.data.status === 'charge success') {
              $scope.view.processingPayment = 'delivering';
              console.log('charge success');

              // ** Create Respondent by Directly Accessing TTI API (Secure Link)
              mLabs.assignNewPassword(linkInstanceData, form, cart)
              .then(function(data) {
                console.log(data);
                console.log(form.passwords);
                form.passwords = data.data;

                SG.successfulPurchaseEmail(form, schoolCode, linkInstanceData, cart)
                .then(function(data) {
                  $scope.view.processingPayment = 'success';
                  $scope.$apply()

                  console.log(data);
                  localStorageService.set('checkoutStatus', 'post-checkout-on');
                  $state.transitionTo('checkoutSuccess');
                  localStorageService.remove('shoppingCart');
                  $scope.data.redirectHome();

                }).catch(function(error){
                  console.log(error);
                })

              }).catch(function(error) {
                console.log(error);
              })

              // ** Create Respondent by Directly Accessing TTI API (Open Link)

              // console.log(respondentData);
              // TTI_API.createRespondent(schoolCode, respondentData)
              // .then(function(data) {
              //   console.log('success..');
              //   if (data.data.status === "201 Created") {
              //     SG.successfulPurchaseEmail(data.data.body, schoolCode);
              //   } else {
              //     mLabs.getUnassignedPasswords(schoolCode);
              //   }
              // }).catch(function(error) {
              //   console.log(error);
              // })
            }

          }).catch(function(err) {
            console.log(err);
          })
        }
      })
    }

    // Moltin_API.getENV()
    // .then(function(env) {
    //   // console.log(env);
    //   var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
    //   // console.log(moltin);
    //   moltin.Authenticate(function() {
    //     var cart = moltin.Cart.Checkout();
    //     // console.log(cart);
    //     var cartContents = moltin.Cart.Contents();
    //     // console.log(cartContents);
    //     moltin.Cart.Complete({
    //       customer: {
    //         first_name: $scope.form.firstName,
    //         last_name: $scope.form.lastName,
    //         email: $scope.form.email
    //       },
    //       gateway: 'stripe',
    //       bill_to: {
    //         first_name: $scope.form.billingFirstName,
    //         last_name: $scope.form.billingLastName,
    //         address_1: "4500 19th street",
    //         address_2: "203",
    //         city: "Boulder",
    //         county: "Boulder",
    //         country: 'US',
    //         postcode: "80304",
    //         phone: "6109551011"
    //       }
    //     }, function(order) {
    //       // console.log(order);
    //       // console.log(order.id);
    //       moltin.Checkout.Payment('purchase', order.id, {
    //         data: {
    //           first_name: $scope.form.billingFirstName,
    //           last_name: $scope.form.billingLastName,
    //           number: $scope.form.cardNumber,
    //           expiry_month: $scope.form.expM,
    //           expiry_year: $scope.form.expY,
    //           cvv: $scope.form.CVV
    //         }
    //       }, function(payment) {
    //         // console.log(payment);
    //         // console.log(payment.message);
    //         if (payment.message === "Payment completed successfully") {
    //           $scope.$apply();
    //           var schoolCode = localStorageService.get('schoolInstance');
    //           // console.log(schoolCode);
    //           var respondentData = {
    //             first_name: $scope.form.firstName,
    //             last_name: $scope.form.lastName,
    //             email: $scope.form.email,
    //             gender: $scope.form.gender,
    //             company: $scope.form.company,
    //             position_job: $scope.form.position_job
    //           }
    //
    //           // ** Create Respondent by Directly Accessing TTI API (Secure Link)
    //
    //           mLabs.assignNewPassword(schoolCode, respondentData)
    //           .then(function(data) {
    //             // console.log(data);
    //             respondentData.password = data.data.password;
    //             SG.successfulPurchaseEmail(respondentData, schoolCode)
    //             .then(function(data) {
    //               console.log(data);
    //               localStorageService.set('checkoutStatus', 'post-checkout-on');
    //               $state.transitionTo('checkoutSuccess');
    //               $scope.data.emptyCart()
    //               $scope.data.redirectHome();
    //             }).catch(function(error){
    //               console.log(error);
    //             })
    //           }).catch(function(error) {
    //             console.log(error);
    //           })
    //
    //           // ** Create Respondent by Directly Accessing TTI API (Open Link)
    //
    //           // console.log(respondentData);
    //           // TTI_API.createRespondent(schoolCode, respondentData)
    //           // .then(function(data) {
    //           //   console.log('success..');
    //           //   if (data.data.status === "201 Created") {
    //           //     SG.successfulPurchaseEmail(data.data.body, schoolCode);
    //           //   } else {
    //           //     mLabs.getUnassignedPasswords(schoolCode);
    //           //   }
    //           // }).catch(function(error) {
    //           //   console.log(error);
    //           // })
    //         }
    //       }, function(error1, error2) {
    //         console.log(error1);
    //         console.log(error2);
    //         alert("There was an error - please re-enter your payment information and try again.")
    //       });
    //     }, function(error1, error2) {
    //       console.log(error1);
    //       console.log(error2);
    //     });
    //   })
    // })

  }

  $scope.data.resetOrder = function() {
    // console.log('reset order');
    // $scope.data.emptyCart();
    localStorageService.remove('shoppingCart')
    $state.transitionTo('productsPage');
  }

  $scope.data.redirectHome = function() {
    var checkoutStatus = localStorageService.get('checkoutStatus');
    if (checkoutStatus === "post-checkout-off") {
      $state.transitionTo('productsPage');
    } else {
      // localStorageService.set('timeoutStatus', 'on')
      $timeout(function() {
        $scope.view.leaveSite();
      }, 5000)
    }
  }
}])
