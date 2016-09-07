app.controller('Checkout_Controller', ['$scope', '$state', 'Mailgun', function($scope, $state, Mailgun) {
  $scope.view = {};
  $scope.data = {};
  $scope.data.purchaseSubmission = function() {
    Mailgun.successfulPurchaseEmail()
    .then(function(data) {
      console.log(data);
      $state.transitionTo('checkoutSuccess');
    })
  };
}])
