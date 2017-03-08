app.controller('Admin_Controller', ['$scope', '$http', '$timeout', '$state', 'mLabs', 'school_link_conv', 'TTI_API', function($scope, $http, $timeout, $state, mLabs, school_link_conv, TTI_API) {

  $scope.view = {};
  $scope.data = {};
  $scope.newLink = {};

  $scope.view.selectedFunction = $state.current.name
  $scope.view.selectedSchool = "default";
  $scope.view.pWQtyLoaded = false;
  $scope.view.loadFinished = false;
  $scope.view.showLinkCreationInterface = false;
  $scope.view.showLinkListInterface = false;
  $scope.view.addingStudentLink = false;
  $scope.view.glSubmitStatus = '';
  $scope.view.linkListStatus = '';

  $scope.data.pwObj = undefined;
  $scope.data.button = false;

  $scope.newLink.name;
  $scope.newLink.parents = {};
  $scope.newLink.parents.TTIusername;
  $scope.newLink.parents.TTIpassword;
  $scope.newLink.parents.TTIaccountID;
  $scope.newLink.parents.TTIlinkID;
  $scope.newLink.parents.productMaxQty = 2;
  $scope.newLink.parents.productPrice = 25.00;
  $scope.newLink.students = {};
  $scope.newLink.students.TTIusername;
  $scope.newLink.students.TTIpassword;
  $scope.newLink.students.TTIaccountID;
  $scope.newLink.students.TTIlinkID;
  $scope.newLink.students.productMaxQty = 1;
  $scope.newLink.students.productPrice = 25.00;

  // Validate Parent TTI Link
  $scope.data.validateParentLink = function() {
    if ($scope.newLink.parents.TTIusername && $scope.newLink.parents.TTIpassword && $scope.newLink.parents.TTIaccountID && $scope.newLink.parents.TTIlinkID) {
      if ($scope.newLink.parents.TTIlinkID.length === 9) {
        $scope.view.parentLinkIdStatus = "verifying";
        $scope.data.linkStatusMeta = true;
        TTI_API.validateTTILink($scope.newLink.parents.TTIusername, $scope.newLink.parents.TTIpassword, $scope.newLink.parents.TTIaccountID, $scope.newLink.parents.TTIlinkID, "verify")
        .then(function(data1) {
          if (data1.data.error || !data1.data) {
            $scope.view.parentLinkIdStatus = "unverified";
            $scope.$apply();
          } else {
            $scope.view.parentLinkIdStatus = "verified";
            $scope.data.currentParentLinkName = data1.data.linkInfo.link.name
            $scope.$apply();
          }
        })
      } else {
        if ($scope.data.linkStatusMeta) {
          $scope.view.parentLinkIdStatus = "incomplete"
        } else {
          $scope.view.parentLinkIdStatus = "";
        }
      }
    }
  }

  // Validate Student TTI Link
  $scope.data.validateStudentLink = function() {
    if ($scope.newLink.students.TTIusername && $scope.newLink.students.TTIpassword && $scope.newLink.students.TTIaccountID && $scope.newLink.students.TTIlinkID) {
      if ($scope.newLink.students.TTIlinkID.length === 9) {
        $scope.view.studentLinkIdStatus = "verifying";
        $scope.data.linkStatusMeta = true;
        TTI_API.validateTTILink($scope.newLink.students.TTIusername, $scope.newLink.students.TTIpassword, $scope.newLink.students.TTIaccountID, $scope.newLink.students.TTIlinkID, "verify")
        .then(function(data1) {
          if (data1.data.error || !data1.data) {
            $scope.view.studentLinkIdStatus = "unverified";
            $scope.$apply();
          } else {
            $scope.view.studentLinkIdStatus = "verified";
            $scope.data.currentStudentLinkName = data1.data.linkInfo.link.name
            $scope.$apply();
          }
        })
      } else {
        if ($scope.data.linkStatusMeta) {
          $scope.view.studentLinkIdStatus = "incomplete"
        } else {
          $scope.view.studentLinkIdStatus = "";
        }
      }
    }
  }

  $scope.data.submitLinkForGeneration = function() {
    if (confirm("If the entered information is correct, click 'OK'")) {

      $scope.view.glSubmitStatus = 'Processing...';

      var newDateObj = new Date();
      var dateCreated = (newDateObj.getMonth() + 1) + "/" + newDateObj.getDate() + "/" + newDateObj.getFullYear() + " - " + newDateObj.getHours() + ":" + newDateObj.getMinutes() + ":" + newDateObj.getSeconds();

      var linkInfo = {
        name: $scope.newLink.name.replace(/\s/g, ''),
        ogName: $scope.newLink.name,
        schoolCode: $scope.view.selectedSchool,
        dateCreated: dateCreated,
        active: true,
        url: 'https://indigo-parents.herokuapp.com/school-links/' + $scope.view.selectedSchool + '/' + $scope.newLink.name.replace(/\s/g, ''),
        parents: {
          username: $scope.newLink.parents.TTIusername,
          password: $scope.newLink.parents.TTIpassword,
          TTIaccountID: $scope.newLink.parents.TTIaccountID,
          TTIlinkID: $scope.newLink.parents.TTIlinkID,
          productMaxQty: $scope.newLink.parents.productMaxQty = 2,
          productPrice: $scope.newLink.parents.productPrice = 25.00
        }
      };

      if ($scope.view.studentLinkIdStatus === 'verified') {
        linkInfo.students = {
          username: $scope.newLink.students.TTIusername,
          password: $scope.newLink.students.TTIpassword,
          TTIaccountID: $scope.newLink.students.TTIaccountID,
          TTIlinkID: $scope.newLink.students.TTIlinkID,
          productMaxQty: $scope.newLink.students.productMaxQty = 2,
          productPrice: $scope.newLink.students.productPrice = 25.00
        }
      }

      mLabs.addNewGeneratedLink(linkInfo)
      .then(function(data) {
        if (data.data.status === "name already exists") {
          alert("This link name already exists. Please enter a new link name and try again.")
          $scope.view.glSubmitStatus = '';
        } else if (data.data.status === "Success") {
          $scope.view.glSubmitStatus = 'Success!';
        }
        $scope.$apply();
      }).catch(function(err) {
        console.log(err);
      })

    }
  }

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

  $scope.data.glSelectSchool = function() {
    if ($scope.view.selectedSchool !== "default") {
      $scope.view.schoolLink = 'https://indigo-parents.herokuapp.com/school-links/' + $scope.view.selectedSchool;
    }
  };

  $scope.view.showLinkCreation = function() {

    $scope.view.showLinkListInterface = false;
    $scope.view.showLinkCreationInterface = true;

  };

  $scope.view.initializeLinkList = function() {
    return new Promise(function(resolve, reject) {

      $scope.view.linkListStatus = 'loading';

      mLabs.getSchoolLinkList($scope.view.selectedSchool)
      .then(function(data) {
        if (data.data.status === 'empty collection') {
          $scope.view.linkListStatus = 'empty';
        } else if (data.data.status === 'populated'){
          $scope.data.currentLinkList = data.data.docs;
          $scope.view.linkListStatus = 'populated';
        }
        $scope.$apply();
        resolve();
      }).catch(function(err) {
        console.log(err);
      })

    });
  };

  $scope.view.showLinkList = function() {

    $scope.view.showLinkCreationInterface = false;
    $scope.view.showLinkListInterface = true;

    $scope.view.initializeLinkList()
    .then(function() {

    }).catch(function(err) {

    })

  };

  $scope.view.copyLinkUrl = function(index) {

    var url = $('tbody.link-list-body tr:eq(' + index + ') td:eq(1) input');
    url.select();

  }

  $scope.view.toggleStudentLink = function() {
    $scope.view.addingStudentLink = !$scope.view.addingStudentLink;
  };

  $scope.data.showLinkInfo = function(selectedSchool) {
    $scope.view.pWQtyLoaded = false;
    $scope.view.loadFinished = false;
    $http({
      method: 'get',
      url: '/api/' + selectedSchool + '/showLink',
    }).then(function(data) {
      $scope.data.mlPwQty = data.data.length;
      $scope.view.pWQtyLoaded = true;
    })
  }

  $scope.data.loadPwObj = function() {
    console.log('loaded');
  }

  $scope.data.addPasswords = function() {
    $scope.view.loadFinished = false;
    if($scope.data.pwObj) {
      mLabs.loadNewPasswords($scope.view.selectedSchool, $scope.data.pwObj)
      .then(function(data) {
        // console.log(data);
        // console.log(data.data.count);
        $scope.data.showLinkInfo($scope.view.selectedSchool)
        $scope.data.pwAddedCount = data.data.count;
        $scope.view.loadFinished = true;
        $scope.$apply();
      })
    } else {
      alert('no file uploaded')
    }
  }

}])
