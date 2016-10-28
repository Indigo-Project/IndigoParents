app.controller('TTI_Controller', ['$scope', '$http', '$location', 'localStorageService', 'TTI_API', function($scope, $http, $location, localStorageService, TTI_API) {
  $scope.view = {};
  $scope.data = {};
  $scope.data.showRespondent = false;
  $scope.data.createRespondent = function() {
    $scope.data.showRespondent = !$scope.data.showRespondent;
    if ($scope.data.showRespondent) {
      var schoolCode = localStorageService.get("schoolInstance")
      TTI_API.createRespondent(schoolCode, $scope.data.respondentForm);
    }
  }
}])
