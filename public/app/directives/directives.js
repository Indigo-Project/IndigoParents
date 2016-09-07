app.directive('masthead', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/masthead.html'
  }
})

app.directive('landingPage', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/landing_page.html'
  }
})

app.directive('productsPage', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/products_page.html'
  }
})

app.directive('checkoutPage', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/checkout_page.html'
  }
})

app.directive('checkoutSuccess', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/checkout_success.html'
  }
})

app.directive('shoppingCart', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/shopping_cart.html'
  }
})

app.directive('footer', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/footer.html'
  }
})

app.directive('adminPortal', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/admin_portal.html'
  }
})
