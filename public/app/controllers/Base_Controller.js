app.controller("Base_Controller", ['$scope', '$state', '$stateParams', '$timeout', '$q', 'localStorageService', 'school_link_conv', 'mLabs', function($scope, $state, $stateParams, $timeout, $q, localStorageService, school_link_conv, mLabs) {

  $scope.view = {};
  $scope.data = {};

  $scope.data.schoolInstanceCode = $stateParams.schoolCode;
  $scope.data.linkName = $stateParams.linkName;

  // Display school code in 'redirecting to...' on client loading route
  $scope.data.getFullNameByCode = function() {
    school_link_conv.getFullNameByCode($scope.data.schoolInstanceCode)
    .then(function(data) {
      $scope.view.schoolInstance = data.data;
      $scope.$apply();
    })
  }

  // Display school code in 'redirecting to...' on client loading route
  $scope.data.getFullNameByCode();

  $scope.data.storeLinkDatainLS = function() {
    return $q(function(resolve, reject) {
      mLabs.retrieveSchoolLinkData($scope.data.schoolInstanceCode, $scope.data.linkName)
      .then(function(data) {
        var linkInstanceData = data.data.link
        localStorageService.set('linkInstanceData', linkInstanceData);
        if($scope.data.verifySSinLS()) {
          resolve();
        } else {
          reject();
        }
      }).catch(function(err) {
        console.log(err);
      })
    })
  }

  $scope.data.verifySSinLS = function() {
    var linkInstanceData = localStorageService.get("linkInstanceData");
    var schoolCode = linkInstanceData.schoolCode;
    var linkName = linkInstanceData.name;
    if (schoolCode === $stateParams.schoolCode && linkName === $scope.data.linkName) {
      return true;
    } else {
      return false;
    }
  }

  $scope.data.loadLP = function() {
    localStorageService.get('shoppingCart') ? localStorageService.remove('shoppingCart') : null;
    $scope.data.storeLinkDatainLS()
    .then(function() {
      $timeout(function() {
        $state.transitionTo('productsPage')
      }, 1000);
    })
  }

}])
