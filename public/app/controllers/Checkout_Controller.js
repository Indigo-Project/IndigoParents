app.controller('Checkout_Controller', ['$scope', '$state', '$timeout', 'localStorageService', 'Moltin_API', 'TTI_API', 'Mailgun', function($scope, $state, $timeout, localStorageService, Moltin_API, TTI_API, Mailgun) {
  $scope.view = {};
  $scope.data = {};
  $scope.form = {};
  $scope.view.paymentStatus = "";
  $scope.data.lscart = localStorageService.get('cart') || [];
  var cartKey = Object.keys(localStorageService.get('cart')['0'])[0];
  $scope.data.cart = $scope.data.lscart[0][cartKey];
  $scope.data.purchaseSubmission = function() {
    $scope.view.processingPayment = "processing";
    console.log($scope.form);
    Moltin_API.getENV()
    .then(function(env) {
      console.log(env);
      var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
      console.log(moltin);
      moltin.Authenticate(function() {
        var cart = moltin.Cart.Checkout();
        console.log(cart);
        var cartContents = moltin.Cart.Contents();
        console.log(cartContents);
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
          console.log(order);
          console.log(order.id);
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
            console.log(payment);
            console.log(payment.message);
            if (payment.message === "Payment completed successfully") {
              $scope.view.processingPayment = "success";
              $scope.$apply();
              var schoolCode = localStorageService.get('schoolInstance');
              console.log(schoolCode);
              var respondentData = {
                first_name: $scope.form.firstName,
                last_name: $scope.form.lastName,
                email: $scope.form.email,
                gender: $scope.form.gender,
                company: $scope.form.company,
                position_job: $scope.form.position_job
              }
              console.log(respondentData);
              TTI_API.createRespondent(schoolCode, respondentData)
              .then(function(data) {
                Mailgun.successfulPurchaseEmail(data.data, schoolCode);
              }).catch(function(error) {
                console.log(error);
              })
            }
          }, function(error1, error2) {
            console.log(error1);
            console.log(error2);
          });
        }, function(error1, error2) {
          console.log(error1);
          console.log(error2);
        });
      })
    })

    //MOLTIN PAYMENT VERIFICATION
      // Front End Validation
      // API credit card VERIFICATION
      //**** THEN
      // CREATE TTI RESPONDENT WITH USER data
      //**** THEN
      //**** SEND MAILGUN SUCCESSFUL PURCHASE EMAIL with payment VERIFICATION,
      //TTI Link, and TTI Password

    // Mailgun.successfulPurchaseEmail($scope.form)
    // .then(function(data) {
    //   console.log('final result: ', data);
    //   $state.transitionTo('checkoutSuccess');
    // })
  },
  $scope.data.redirectHome = function() {
    $timeout(function() {
      $state.transitionTo('landingPage');
    }, 10000)
  }
}])
