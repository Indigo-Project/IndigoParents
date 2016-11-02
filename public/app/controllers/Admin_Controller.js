app.controller('Admin_Controller', ['$scope', '$http', '$state', 'mLabs', 'school_link_conv', function($scope, $http, $state, mLabs, school_link_conv) {

  $scope.view = {};
  $scope.data = {};

  $scope.view.selectedFunction = $state.current.name
  $scope.view.selectedSchool = "default";
  $scope.data.pwObj = undefined;
  $scope.data.button = false;

  // admin login from /admin
  $scope.data.submitPassword = function(password) {
    $http({
      method: 'post',
      url: '/admin-s/login',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { password: password }
    }).then(function(data) {
      if(data.data === "valid") {
        $state.transitionTo('adminPortal');
      } else {
        alert("invalid password - try again");
      }
    })
  }

  // dynamically change options based on selected function
  $scope.view.accessFunction = function() {
    if ($scope.view.selectedFunction === "addPasswords") {
      $state.go("addPasswords");
    } else if ($scope.view.selectedFunction === "generateLink"){
      $state.go("generateLink");
    } else if ($scope.view.selectedFunction === "adminPortal"){
      $state.go("adminPortal");
    }
  }

  $scope.view.showButton = function() {
    $scope.data.button = true;
    $scope.$apply();
  }

  $scope.data.generateLink = function() {
    if ($scope.view.selectedSchool !== "default") {
      $scope.view.schoolLink = 'http://www.indigotheassessment.com/school-links/' + $scope.view.selectedSchool;
    }
  }

  $scope.data.showLinkInfo = function(selectedSchool) {
    $http({
      method: 'post',
      url: '/api/showLink',
      headers: {
        'Content-Type': 'application/json'
      },
      data: { selectedSchool: selectedSchool }
    }).then(function(data) {
      console.log(data);
    })
  }

  $scope.data.loadPwObj = function() {
    console.log('loaded');
  }

  $scope.data.addPasswords = function() {
    console.log(1);
    if($scope.data.pwObj) {
      console.log(2);
      mLabs.loadNewPasswords($scope.view.selectedSchool, $scope.data.pwObj)
      .then(function(data) {
        $scope.data.pwAddedCount = data.count;
      })
    } else {
      alert('no file uploaded')
    }
  }

}])
