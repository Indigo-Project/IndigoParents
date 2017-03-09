app.controller('Cart_Controller', ['$scope', '$state', '$http', 'localStorageService', 'Moltin_API', function($scope, $state, $http, localStorageService, Moltin_API) {

  $scope.view = {};
  $scope.data = {};

  $scope.data.mastheadLoaded = true;
  $scope.data.purchaseCta = 'Add To Cart';

  $scope.cart = {};
  // set cartKey variable to key of cart object
  // console.log(localStorageService.get('cart'));
  // console.log(Object.keys(localStorageService.get('cart')['0']));
  // var cartKey = Object.keys(localStorageService.get('cart')['0'])[0] || null;
  var invQty = localStorageService.get('invQty') || 0;
  // console.log(invQty);

  // console.log(localStorageService.get('checkoutStatus'));
  if (localStorageService.get('checkoutStatus') === 'post-checkout-off') {
    // console.log('TRUE');
  }


  // console.log(localStorageService.get('cart'));
  if (localStorageService.get('cart') !== null) {
    var cartKey = Object.keys(localStorageService.get('cart')['0'])[0];
    $scope.data.cartKey = Object.keys(localStorageService.get('cart')['0'])[0];
  } else {
    var cartKey = null;
    $scope.data.cartKey = null;
  }
  // console.log($scope.data.cartKey);

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

  $scope.data.linkInstanceData = localStorageService.get('linkInstanceData');
  $scope.data.studentProductExists = $scope.data.linkInstanceData.students ? true : false;
  console.log($scope.data.linkInstanceData.parents.productMaxQty);
  console.log($scope.data.linkInstanceData.students.productMaxQty);
  console.log($scope.data.studentProductExists);
  $scope.data.cartExists = localStorageService.get('shoppingCart') ? true : false;

  // run when user clicks 'add to cart' from products page
  $scope.data.addToCart = function(productSlug) {

    $scope.data.purchaseCta = "Loading..."
    localStorageService.set('checkoutStatus', 'in-progress');

    var linkInstanceData = localStorageService.get('linkInstanceData');
    $scope.cart.parentsProductPrice = linkInstanceData.parents.productPrice;
    linkInstanceData.students ? $scope.cart.studentsProductPrice = linkInstanceData.students.productPrice : null;

    // Apply updates to cart (if done so through products page)
    var currentCart = localStorageService.get('shoppingCart');
    if (currentCart) {
      (currentCart.parentOrderQuantity + $scope.cart.parentOrderQuantity) >= $scope.data.linkInstanceData.parents.productMaxQty ?  alert('Exceeds cart limit for parent version') : currentCart.parentOrderQuantity += $scope.cart.parentOrderQuantity;
      currentCart.studentOrderQuantity ? (currentCart.studentOrderQuantity + $scope.cart.studentOrderQuantity) >= $scope.data.linkInstanceData.students.productMaxQty ? alert('Exceeds cart limit for student version') : currentCart.studentOrderQuantity += $scope.cart.studentOrderQuantity : null;
      // currentCart.parentOrderQuantity += $scope.cart.parentOrderQuantity;



      localStorageService.set('shoppingCart', currentCart);
    } else {
      localStorageService.set('shoppingCart', $scope.cart);
    }

    // If LS cart object exists, go to checkout
    localStorageService.get('shoppingCart') ? $state.transitionTo('checkoutMain') : null;


    // if($scope.cart.parentOrderQuantity < 1) {

      // Moltin_API.getENV()
      // .then(function(env) {
      //   var moltin = new Moltin({publicId: env.data.MOLTIN_CLIENT_ID});
      //   // console.log(moltin);
      //   moltin.Authenticate(function() {
      //     Moltin_API.getIndigoInventory()
      //     .then(function(data){
      //       var item = moltin.Cart.Insert(data.product_id, 1, null)
      //       var checkoutObj = moltin.Cart.Checkout();
      //       // console.log(checkoutObj);
      //       var cart = moltin.Cart.Contents();
      //       var cartContents = [];
      //       cartContents.push(cart.contents);
      //       localStorageService.set("cart", cartContents);
      //       if (localStorageService.get('cart') !== null) {
      //         var cartKey = Object.keys(localStorageService.get('cart')['0'])[0]
      //       } else {
      //         var cartKey = null;
      //       }
      //       if(cartKey === null) {
      //         $scope.data.cart = [];
      //         var iiCartItem = null;
      //       } else {
      //         $scope.data.cart = localStorageService.get('cart');
      //         var iiCartItem = $scope.data.cart['0'][cartKey];
      //       }
      //       console.log(cartKey);
      //       $scope.data.calcTotalCartQty();
      //       $scope.$apply();
      //       localStorageService.set('invQty', 1);
      //       $state.transitionTo('checkoutMain');
      //     }).catch(function(error) {
      //       console.log(error);
      //     })
      //   })
      // }).catch(function(error) {
      //   console.log(error);
      // })
    // } else if ($scope.cart.parentOrderQuantity >= 1) {
    //    $state.transitionTo('checkoutMain');
    // }
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
