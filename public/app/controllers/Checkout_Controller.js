app.controller('Checkout_Controller', ['$scope', '$state', '$timeout', '$window','localStorageService', 'mLabs', 'Moltin_API', 'TTI_API', 'SG', function($scope, $state, $timeout, $window, localStorageService, mLabs, Moltin_API, TTI_API, SG) {
  $scope.view = {};
  $scope.data = {};
  $scope.form = {};
  $scope.view.paymentStatus = "";

  $scope.view.checkoutAccess = localStorageService.get('checkoutStatus') || null;
  console.log($scope.view.checkoutAccess);

  if($scope.view.checkoutAccess === "post-checkout-off") {
    $state.transitionTo("productsPage");
  }

  $scope.view.leaveSite = function() {
    localStorageService.set('checkoutStatus', 'post-checkout-off')
    $window.location.href = "http://www.indigoproject.org/parent-night";
  }

  $scope.data.lscart = localStorageService.get('cart') || [];

  var cartKey = Object.keys(localStorageService.get('cart')['0'])[0];
  $scope.data.cart = $scope.data.lscart[0][cartKey];
  console.log($scope.data.cart);

  if (localStorageService.get('cart') !== null) {
    var cartKey = Object.keys(localStorageService.get('cart')['0'])[0];
    $scope.data.cartKey = Object.keys(localStorageService.get('cart')['0'])[0];
  } else {
    var cartKey = null;
    $scope.data.cartKey = null;
  }
  // console.log($scope.data.cartKey);

  // if no cartKey, $scope.data.cart = null, otherwise = localStorage Cart Object
  if(cartKey === null) {
    $scope.data.cart = [];
    var iiCartItem = null;
  } else {
    $scope.data.cart = localStorageService.get('cart')['0'][cartKey];
    var iiCartItem = $scope.data.cart;
  }

  // if iiCartItem totalCartQty = quantity of cart Item, otherwise = 0;
  if (iiCartItem) {
    $scope.data.totalCartQty = iiCartItem.quantity
  } else {
    $scope.data.totalCartQty = 0;
  }

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
    if($scope.data.totalCartQty > 1) {
      alert('We currently only support purchases of 1 assessment at a time. If you would like to purchase more, please re-open the original link after checkout. Click "reset-order" to reset your order.')
    } else {
      $scope.view.processingPayment = "processing";
      // console.log($scope.form);
      Moltin_API.getENV()
      .then(function(env) {
        // console.log(env);
        var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
        // console.log(moltin);
        moltin.Authenticate(function() {
          var cart = moltin.Cart.Checkout();
          // console.log(cart);
          var cartContents = moltin.Cart.Contents();
          // console.log(cartContents);
          moltin.Cart.Complete({
            customer: {
              first_name: $scope.form.firstName,
              last_name: $scope.form.lastName,
              email: $scope.form.email
            },
            gateway: 'stripe',
            bill_to: {
              first_name: $scope.form.billingFirstName,
              last_name: $scope.form.billingLastName,
              address_1: "4500 19th street",
              address_2: "203",
              city: "Boulder",
              county: "Boulder",
              country: 'US',
              postcode: "80304",
              phone: "6109551011"
            }
          }, function(order) {
            // console.log(order);
            // console.log(order.id);
            moltin.Checkout.Payment('purchase', order.id, {
              data: {
                first_name: $scope.form.billingFirstName,
                last_name: $scope.form.billingLastName,
                number: $scope.form.cardNumber,
                expiry_month: $scope.form.expM,
                expiry_year: $scope.form.expY,
                cvv: $scope.form.CVV
              }
            }, function(payment) {
              // console.log(payment);
              // console.log(payment.message);
              if (payment.message === "Payment completed successfully") {
                $scope.$apply();
                var schoolCode = localStorageService.get('schoolInstance');
                // console.log(schoolCode);
                var respondentData = {
                  first_name: $scope.form.firstName,
                  last_name: $scope.form.lastName,
                  email: $scope.form.email,
                  gender: $scope.form.gender,
                  company: $scope.form.company,
                  position_job: $scope.form.position_job
                }

                // ** Create Respondent by Directly Accessing TTI API (Secure Link)

                mLabs.assignNewPassword(schoolCode)
                .then(function(data) {
                  // console.log(data);
                  respondentData.password = data.data.password;
                  SG.successfulPurchaseEmail(respondentData, schoolCode)
                  .then(function(data) {
                    console.log(data);
                    localStorageService.set('checkoutStatus', 'post-checkout-on');
                    $state.transitionTo('checkoutSuccess');
                    $scope.data.emptyCart()
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
            }, function(error1, error2) {
              console.log(error1);
              console.log(error2);
              alert("There was an error - please re-enter your payment information and try again.")
            });
          }, function(error1, error2) {
            console.log(error1);
            console.log(error2);
          });
        })
      })
    }
  }

  $scope.data.resetOrder = function() {
    console.log('reset order');
    $scope.data.emptyCart();
    $state.transitionTo('productsPage');
  }

  $scope.data.redirectHome = function() {
    $timeout(function() {
      $scope.view.leaveSite();
    }, 5000)
  }
}])
