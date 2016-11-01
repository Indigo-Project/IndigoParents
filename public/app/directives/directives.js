app.directive('masthead', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/masthead.html',
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
    templateUrl: 'app/directives/partials/products_page.html',
    controller: 'Products_Controller'
  }
})

app.directive('checkoutPage', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/checkout_page.html',
    controller: 'Checkout_Controller'
  }
})

app.directive('checkoutSuccess', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/checkout_success.html',
    controller: 'Checkout_Controller'
  }
})

app.directive('shoppingCart', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/shopping_cart.html',
    controller: 'Cart_Controller'
  }
})

app.directive('footer', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/footer.html'
  }
})

app.directive('adminLogin', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/admin_login.html',
    controller: "Admin_Controller"
  }
})

app.directive('adminPortal', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/admin_portal.html',
    controller: "Admin_Controller"
  }
})

app.directive('addPasswords', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/add_passwords.html',
    controller: "Admin_Controller",
  }
})

app.directive('fileread', function() {
  return {
    restrict: 'A',
    scope: {
      fileread: "=",
    },
    link: function (scope, element, attributes) {
      element.bind("change", function (changeEvent) {
        var reader = new FileReader();
          reader.onload = function (loadEvent) {
            // console.log(loadEvent);
            var csv_file = atob(loadEvent.target.result.substring(21));
            // console.log(csv_file);
            scope.$apply(function () {
              scope.fileread = csv_file;
            });
          }
          // console.log(changeEvent);
          reader.readAsDataURL(changeEvent.target.files[0]);
        });
    },
    // controller: "Pbi_Pfmt_Controller"
  }
})

app.directive('generateLink', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/generate_link.html',
    controller: "Admin_Controller"
  }
})

app.directive('schoolSiteRedirect', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/directives/partials/school_site_redirect.html',
    controller: "Base_Controller"
  }
})
