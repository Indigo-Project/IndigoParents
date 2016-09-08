app.controller('Cart_Controller', ['$scope', '$state', function($scope, $state) {
  $scope.view = {};
  $scope.data = {};
  $scope.data.totalCartQty = Number(JSON.parse(localStorage.getItem('indigoParentsCartQty'))) || 0;
  $scope.view.cartEmpty = $scope.data.totalCartQty > 0 || true;
  $scope.data.mastheadLoaded = true;
  $scope.data.cart = JSON.parse(localStorage.getItem('indigoParentsCart')) || [];
  $scope.data.updateCartStatus = function() {
    if ($scope.data.totalCartQty > 0) {
      $scope.view.cartEmpty = false;
    } else {
      $scope.view.cartEmpty = true;
    };
  }

  // $scope.data.updateCartStatus();

  $scope.data.calcTotalCartQty = function() {
    $scope.data.totalCartQty = 0;
    for (var i = 0; i < $scope.data.cart.length; i++) {
      $scope.data.totalCartQty += $scope.data.cart[i].quantity;
    }
    localStorage.setItem('indigoParentsCartQty', $scope.data.totalCartQty)
    $scope.data.updateCartStatus();
  }
  $scope.data.addToCart = function(productSlug) {
    $scope.data.cart.push({product: productSlug, quantity: $scope.form.orderQuantity});
    localStorage.setItem('indigoParentsCart', JSON.stringify($scope.data.cart));
    $scope.data.calcTotalCartQty();
  }
}])
