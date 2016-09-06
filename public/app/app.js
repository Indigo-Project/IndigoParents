var app = angular.module('indigo', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('landingPage', {
      url: '/',
      templateUrl: "templates/landing_page.html",
    })
    .state('productsPage', {
      url: '/products',
      templateUrl: "templates/products_page.html"
    })
    .state('shoppingCart', {
      url: '/cart',
      templateUrl: "templates/shopping_cart.html"
    })
    .state('checkoutMain', {
      url: '/checkout',
      templateUrl: "templates/checkout_page.html"
    })
    .state('checkoutSuccess', {
      url: '/success',
      templateUrl: "templates/checkout_success.html"
    })
    .state('adminPortal', {
      url: '/admin',
      templateUrl: "templates/admin_portal.html"
    })
    .state('TTITest', {
      url: '/admin',
      templateUrl: "templates/utility/tti_api_test.html"
    })

    $locationProvider.html5Mode(true);
})
