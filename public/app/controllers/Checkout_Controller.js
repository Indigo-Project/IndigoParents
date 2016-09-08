app.controller('Checkout_Controller', ['$scope', '$state', 'Mailgun', function($scope, $state, Mailgun) {
  $scope.view = {};
  $scope.data = {};
  $scope.data.lscart = JSON.parse(localStorage.getItem('moltin_cart')) || [];
  $scope.data.cart = $scope.data.lscart[0]['826f6d0ae11323676ad968c82c15fa5b'];
  $scope.data.purchaseSubmission = function() {
    Mailgun.successfulPurchaseEmail()
    .then(function(data) {
      console.log(data);
      $state.transitionTo('checkoutSuccess');
    })
  };
}])
