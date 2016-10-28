app.controller('Cart_Controller', ['$scope', '$state', 'localStorageService', 'Moltin_API', function($scope, $state, localStorageService, Moltin_API) {

  $scope.view = {};
  $scope.data = {};
  $scope.data.mastheadLoaded = true;
  $scope.data.cart = localStorageService.get('cart') || [];
  console.log($scope.data.cart);
  if ($scope.data.cart['0']['826f6d0ae11323676ad968c82c15fa5b']) {
    $scope.data.totalCartQty = $scope.data.cart['0']['826f6d0ae11323676ad968c82c15fa5b'].quantity
  } else {
    $scope.data.totalCartQty = 0;
  }
  console.log($scope.data.totalCartQty);
  $scope.view.cartEmpty = $scope.data.totalCartQty <= 0;
  console.log($scope.view.cartEmpty);
  $scope.data.cartLoaded = false;
  // console.log("ls cart: ", $scope.data.cart);
  // console.log($scope.data.cart[0]['826f6d0ae11323676ad968c82c15fa5b'].quantity <= 0);
  // console.log("ls cart: ", $scope.data.cart[0]['826f6d0ae11323676ad968c82c15fa5b'].quantity);

  // $scope.data.cart = JSON.parse(localStorageService.get('indigoParentsCart')) || [];
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
    }
  }
  $scope.data.updateCartStatus();

  $scope.data.calcTotalCartQty = function() {
    $scope.data.totalCartQty = $scope.data.cart[0]['826f6d0ae11323676ad968c82c15fa5b'].quantity;
    $scope.data.updateCartStatus();
  }

  $scope.data.addToCart = function(productSlug) {

    Moltin_API.getENV()
    .then(function(env) {
      var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
      moltin.Authenticate(function() {
        Moltin_API.getIndigoInventory()
        .then(function(data){
          var item = moltin.Cart.Insert(data.product_id, $scope.form.orderQuantity, null)
          var cart = moltin.Cart.Contents();
          var cartContents = [];
          cartContents.push(cart.contents);
          localStorageService.set("cart", cartContents);
          $scope.data.cart = localStorageService.get('cart');
          console.log($scope.data.cart);
          $scope.data.calcTotalCartQty();
          $scope.$apply();
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
          var cart = moltin.Cart.Contents();
          var cartContents = [];
          cartContents.push(cart.contents);
          localStorageService.set("cart", cartContents);
          $scope.data.cart = localStorageService.get('cart');
          $scope.data.totalCartQty = 0;
          $scope.data.updateCartStatus();
          $scope.$apply();
          $state.reload();
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
    console.log(quantity);
    Moltin_API.getENV()
    .then(function(env) {
      var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
      moltin.Authenticate(function() {
        moltin.Cart.Update('826f6d0ae11323676ad968c82c15fa5b', {
          quantity: quantity
        }, function(item) {
          console.log(item);
          var cart = moltin.Cart.Contents();
          var cartContents = [];
          cartContents.push(cart.contents);
          localStorageService.set("cart", cartContents);
          $scope.data.cart = localStorageService.get('cart');
          $scope.$apply();
          $state.reload();
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
