app.controller('Checkout_Controller', ['$scope', '$state', '$timeout', 'Mailgun', function($scope, $state, $timeout, Mailgun) {
  $scope.view = {};
  $scope.data = {};
  $scope.form = {};
  $scope.data.lscart = JSON.parse(localStorage.getItem('moltin_cart')) || [];
  $scope.data.cart = $scope.data.lscart[0]['826f6d0ae11323676ad968c82c15fa5b'];
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
