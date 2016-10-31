app.controller('Checkout_Controller', ['$scope', '$state', '$timeout', 'localStorageService', 'Mailgun', function($scope, $state, $timeout, localStorageService, Mailgun) {
  $scope.view = {};
  $scope.data = {};
  $scope.form = {};
  $scope.data.lscart = localStorageService.get('cart') || [];
  var cartKey = Object.keys(localStorageService.get('cart')['0'])[0]
  $scope.data.cart = $scope.data.lscart[0][cartKey];
  $scope.data.purchaseSubmission = function() {
    console.log($scope.form);

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
