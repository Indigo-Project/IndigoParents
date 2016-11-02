app.controller("Base_Controller", ['$scope', '$state', '$stateParams', '$timeout', '$q', 'localStorageService', 'school_link_conv', function($scope, $state, $stateParams, $timeout, $q, localStorageService, school_link_conv) {

  $scope.view = {};
  $scope.data = {};

  $scope.data.schoolInstanceCode = $stateParams.name;

  $scope.data.getFullNameByCode = function() {
    school_link_conv.getFullNameByCode($scope.data.schoolInstanceCode)
    .then(function(data) {
      $scope.view.schoolInstance = data.data;
      $scope.$apply();
    })
  }

  $scope.data.getFullNameByCode();

  $scope.data.storeSSinLS = function() {
    return $q(function(resolve, reject) {
      localStorageService.set("schoolInstance", $scope.data.schoolInstanceCode);
      if($scope.data.verifySSinLS) {
        resolve();
      } else {
        reject();
      }
    })
  }

  $scope.data.verifySSinLS = function() {
    if (localStorageService.get("schoolInstance") === $stateParams.name) {
      return true;
    } else {
      return false;
    }
  }

  $scope.data.loadLP = function() {
    $scope.data.storeSSinLS()
    .then(function() {
      $timeout(function() {
        $state.transitionTo('productsPage')
      }, 1000);
    })
  }

}])
