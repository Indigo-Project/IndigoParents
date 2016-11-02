app.controller('Post-Checkout_Controller', ['$scope', '$state', 'localStorageService', function($scope, $state, localStorageService){

  var checkoutStatus = localStorageService.get('checkoutStatus')
  if (checkoutStatus === 'post-checkout-on') {
    localStorageService.set('checkoutStatus', 'post-checkout-mid')
  }

}])
