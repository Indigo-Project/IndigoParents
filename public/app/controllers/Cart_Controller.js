app.controller('Cart_Controller', ['$scope', '$state', 'Moltin_API', function($scope, $state, Moltin_API) {

  $scope.view = {};
  $scope.data = {};
  $scope.data.totalCartQty = Number(JSON.parse(localStorage.getItem('indigoParentsCartQty'))) || 0;
  $scope.view.cartEmpty = $scope.data.totalCartQty > 0 || true;
  $scope.data.mastheadLoaded = true;
  $scope.data.cart = JSON.parse(localStorage.getItem('moltin_cart')) || [];
  $scope.data.cartLoaded = false;
  console.log("ls moltin_cart: ", $scope.data.cart);
  // console.log("ls moltin_cart: ", $scope.data.cart[0]['826f6d0ae11323676ad968c82c15fa5b']);

  // $scope.data.cart = JSON.parse(localStorage.getItem('indigoParentsCart')) || [];
  // $scope.data.displayCart = function() {
  //   Moltin_API.getIndigoInventory()
  //     .then(function(data){
  //       console.log(data.product_id);
  //     })
  // }
  $scope.data.updateCartStatus = function() {
    if ($scope.data.totalCartQty > 0) {
      $scope.view.cartEmpty = false;
    } else {
      $scope.view.cartEmpty = true;
    };
  }
  $scope.data.updateCartStatus();

  $scope.data.calcTotalCartQty = function() {
    $scope.data.totalCartQty = 0;
    for (var i = 0; i < $scope.data.cart.length; i++) {
      $scope.data.totalCartQty += $scope.data.cart[i].quantity;
    }
    localStorage.setItem('indigoParentsCartQty', $scope.data.totalCartQty)
  }

  $scope.data.addToCart = function(productSlug) {
    // $scope.data.cart.push({product: productSlug, quantity: $scope.form.orderQuantity});
    // localStorage.setItem('indigoParentsCart', JSON.stringify($scope.data.cart));
    // $scope.data.calcTotalCartQty();
    // $scope.data.updateCartStatus();

    Moltin_API.getENV()
    .then(function(env) {
      var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
      console.log(moltin);
      moltin.Authenticate(function() {
        Moltin_API.getIndigoInventory()
        .then(function(data){
          var item = moltin.Cart.Insert(data.product_id, $scope.form.orderQuantity, null)
          var cart = moltin.Cart.Contents();
          var cartContents = [];
          cartContents.push(cart.contents);
          localStorage.setItem("moltin_cart", JSON.stringify(cartContents));
          $state.transitionTo('shoppingCart');
        }).catch(function(error) {
          console.log(error);
        })
      });
    }).catch(function(error) {
      console.log(error);
    })
  }

  $scope.data.emptyCart = function() {
    Moltin_API.getENV()
    .then(function(env) {
      var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
      moltin.Authenticate(function() {
        moltin.Cart.Remove('826f6d0ae11323676ad968c82c15fa5b', function() {
          console.log('indigo-inventory removed from cart');
          var cart = moltin.Cart.Contents();
          var cartContents = [];
          cartContents.push(cart.contents);
          localStorage.setItem("moltin_cart", JSON.stringify(cartContents));
          $scope.data.cart = JSON.parse(localStorage.getItem('moltin_cart'));
          $scope.$apply();
        },
        function(error) {
          console.log(error);
        });
      })
    }).catch(function(error) {
      console.log(error);
    })
  }

  $scope.data.updateCartQuantity = function(quantity) {
    Moltin_API.getENV()
    .then(function(env) {
      var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
      moltin.Authenticate(function() {
        moltin.Cart.Update('826f6d0ae11323676ad968c82c15fa5b', {
          quantity: quantity
        }, function(item) {
          console.log(item);
        },
        function(error) {
          console.log(error);
        });
      })
    }).catch(function(error) {
      console.log(error);
    })
  }

}])
