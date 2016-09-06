app.controller('TTI_Controller', ['$scope', '$http', '$location', 'TTI_API', function($scope, $http, $location, TTI_API) {
  $scope.view = {};
  $scope.data = {};
  $scope.data.showRespondent = false;
  $scope.data.createRespondent = function() {
    $scope.data.showRespondent = !$scope.data.showRespondent;
    if ($scope.data.showRespondent) {
      // console.log("angular client form data: ", $scope.data.respondentForm);
      TTI_API.postRespondentToServer($scope.data.respondentForm);
    }
  }
  $scope.viewRespondentAPIData = function() {
    $location.path("/api");
  }
}])
