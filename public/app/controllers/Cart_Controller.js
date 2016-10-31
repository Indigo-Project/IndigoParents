app.controller('Cart_Controller', ['$scope', '$state', 'localStorageService', 'Moltin_API', function($scope, $state, localStorageService, Moltin_API) {

  $scope.view = {};
  $scope.data = {};

  $scope.data.mastheadLoaded = true;

  // set cartKey variable to key of cart object
  // console.log(localStorageService.get('cart'));
  // console.log(Object.keys(localStorageService.get('cart')['0']));
  // var cartKey = Object.keys(localStorageService.get('cart')['0'])[0] || null;

  // console.log(localStorageService.get('cart'));
  if (localStorageService.get('cart') !== null) {
    var cartKey = Object.keys(localStorageService.get('cart')['0'])[0];
    $scope.data.cartKey = Object.keys(localStorageService.get('cart')['0'])[0];
  } else {
    var cartKey = null;
    $scope.data.cartKey = null;
  }
  console.log($scope.data.cartKey);

  // if no cartKey, $scope.data.cart = null, otherwise = localStorage Cart Object
  if(cartKey === null) {
    $scope.data.cart = [];
    var iiCartItem = null;
  } else {
    $scope.data.cart = localStorageService.get('cart');
    var iiCartItem = $scope.data.cart['0'][cartKey];
  }

  // if iiCartItem totalCartQty = quantity of cart Item, otherwise = 0;
  if (iiCartItem) {
    $scope.data.totalCartQty = iiCartItem.quantity
  } else {
    $scope.data.totalCartQty = 0;
  }

  $scope.view.cartEmpty = $scope.data.totalCartQty <= 0;

  $scope.data.cartLoaded = false;

  // update view.cartEmpty based on totalCart Qty
  $scope.data.updateCartStatus = function() {
    if ($scope.data.totalCartQty > 0) {
      $scope.view.cartEmpty = false;
    } else {
      $scope.view.cartEmpty = true;
    }
  }

  // run updateCartStatus on controller instantiation
  $scope.data.updateCartStatus();

  // calculate total cart quantity
  $scope.data.calcTotalCartQty = function() {
    if (cartKey === null || cartKey === undefined) {
      $scope.data.totalCartQty = 0;
    } else {
      // console.log($scope.data.cart[0]);
      // console.log($scope.data.cart['0']);
      // console.log(cartKey);
      $scope.data.totalCartQty = $scope.data.cart[0][cartKey].quantity || 0;
    }
    $scope.data.updateCartStatus();
  }

  // run when user clicks 'add to cart' from products page
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
          if (localStorageService.get('cart') !== null) {
            var cartKey = Object.keys(localStorageService.get('cart')['0'])[0]
          } else {
            var cartKey = null;
          }
          if(cartKey === null) {
            $scope.data.cart = [];
            var iiCartItem = null;
          } else {
            $scope.data.cart = localStorageService.get('cart');
            var iiCartItem = $scope.data.cart['0'][cartKey];
          }
          console.log(cartKey);
          $scope.data.calcTotalCartQty();
          $scope.$apply();
          $state.transitionTo('shoppingCart');
        }).catch(function(error) {
          console.log(error);
        })
      })
    }).catch(function(error) {
      console.log(error);
    })
  }

  // run when user clicks 'empty cart' in cart
  $scope.data.emptyCart = function() {
    Moltin_API.getENV()
    .then(function(env) {
      var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
      moltin.Authenticate(function() {
        // var cartID =
        moltin.Cart.Remove(cartKey, function() {
          var cart = moltin.Cart.Contents();
          var cartContents = [];
          cartContents.push(cart.contents);
          localStorageService.set("cart", cartContents);
          $scope.data.cart = localStorageService.get("cart");
          $scope.data.totalCartQty = 0;
          if (localStorageService.get('cart') !== null) {
            var cartKey = Object.keys(localStorageService.get('cart')['0'])[0]
          } else {
            var cartKey = null;
          }
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

  //
  $scope.data.updateCartQuantity = function(quantity) {
    console.log(quantity);
    Moltin_API.getENV()
    .then(function(env) {
      var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
      moltin.Authenticate(function() {
        moltin.Cart.Update(cartKey, {
          quantity: quantity
        }, function(item) {
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

  $scope.data.goToCheckout = function() {
    if ($scope.data.totalCartQty < 1 || $scope.data.totalCartQty === undefined) {
      alert('no items in cart');
    } else {
      $state.transitionTo('checkoutMain');
    }
  }

}])
