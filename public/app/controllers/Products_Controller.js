app.controller('Products_Controller', ['$scope', '$state', '$timeout', 'localStorageService', 'Moltin_API', function($scope, $state, $timeout, localStorageService, Moltin_API){
  $scope.view = {};
  $scope.data = {};
  $scope.data.products = [];
  $scope.data.productsLoaded = false;
  $scope.data.orderQuantity = 1;

  var checkoutStatus = localStorageService.get('checkoutStatus')
  if(checkoutStatus === "post-checkout-off" || checkoutStatus === "post-checkout-on") {
    localStorageService.remove('checkoutStatus')
    localStorageService.remove('invQty')
  }

  // $scope.data.timeoutStatus = localStorageService.get('timeoutStatus') || "off";
  //
  // if ($scope.data.timeoutStatus === "on") {
  //   $timeout.cancel(timer);
  // }

  $scope.data.getIndigoInventory = function() {
    Moltin_API.getIndigoInventory()
    .then(function(data) {
      $scope.data.indigoInventory = data;
      $scope.data.products.push(data);
      $scope.data.productsLoaded = true;
      $scope.$apply();
    }).catch(function(error) {
      console.log(error);
    })
  }

}])
