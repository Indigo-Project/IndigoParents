app.controller('Products_Controller', ['$scope', '$state', 'Moltin', function($scope, $state, Moltin){
  $scope.view = {};
  $scope.data = {};
  $scope.data.products = [];
  $scope.data.productsLoaded = false;
  $scope.data.orderQuantity = 1;
  $scope.data.getIndigoInventory = function() {
    Moltin.getIndigoInventory()
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
