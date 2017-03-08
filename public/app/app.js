var app = angular.module('indigo', ['ui.router', 'LocalStorageModule']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, localStorageServiceProvider) {

  localStorageServiceProvider.setPrefix("indigoParents");

  $urlRouterProvider.otherwise("/");

  $stateProvider
    // .state('landingPage', {
    //   url: '/',
    //   templateUrl: "templates/landing_page.html",
    // })
    .state('productsPage', {
      url: '/',
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
    .state('adminLogin', {
      url: '/admin',
      templateUrl: "templates/admin_login.html"
    })
    .state('adminPortal', {
      url: '/admin/portal/default',
      templateUrl: "templates/admin_portal.html"
    })
    .state('addPasswords', {
      url: '/admin/portal/addpasswords',
      templateUrl: "templates/add_passwords.html"
    })
    .state('generateLink', {
      url: '/admin/portal/generatelink',
      templateUrl: "templates/generate_link.html"
    })
    .state('schoolSiteRedirect', {
      url: '/school-links/:schoolCode/:linkName',
      templateUrl: "templates/school_site_redirect.html"
    })
    .state('TTITest', {
      url: '/api-test',
      templateUrl: "templates/utility/tti_api_test.html",
      controller: "TTI_Controller"
    })

    $locationProvider.html5Mode(true);
})
