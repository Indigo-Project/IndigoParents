// TTI Service - connect to server-side TTI API
app.factory('TTI_API', ['$http', function($http) {
  var service = {};
  service.showLink = function(accountID, linkID) {
    console.log(accountID, linkID);
    $http({
      method: "POST",
      url: "/api/showLink",
      data: { accountID: accountID, linkID: linkID }
    })
  }
  service.createRespondent = function(school, data) {
    return new Promise(function(resolve,reject) {
      $http({
        method: "POST",
        url: "/api/create-respondent",
        data: { school: school, data: data }
      }).then(function(data) {
        console.log(data);
        if (data) {
          resolve(data)
        } else {
          reject('error')
        }
      }).catch(function(error) {
        console.log(error);
      })
    })
  }
  return service;
}])

// Sendgrid Service - connect to server-side SG API
app.factory('SG', ['$http', '$location', '$timeout', function($http, $location, $timeout) {
  var service = {};
  service.successfulPurchaseEmail = function(data, schoolCode) {
    return new Promise(function(resolve, reject) {
      console.log(data);
      console.log(schoolCode);
      $http({
        method: "POST",
        url: "/mail/send",
        data: { data: data, schoolCode: schoolCode }
      }).then(function(maildata) {
        console.log(maildata.status === 200);
        if(maildata.status === 200) {
          resolve('posted to /mail url, email sent');
        } else {
          reject('email not sent');
        }
      }).catch(function(err) {
        console.log(err);
      })
    })
  }
  return service;
}])

// Moltin Service - connect to server-side Moltin API
app.factory('Moltin_API', ['$http', function($http){
  var service = {};
  service.getIndigoInventory = function() {
    return new Promise(function(resolve, reject){
      $http({
        method: "GET",
        url: "/api/products/indigo-inventory"
      }).then(function(data) {
        if (data.data.product_id === "1334169416354496686") {
          resolve(data.data);
        } else {
          reject('product load unsuccessful')
        }
      }).catch(function(err) {
        console.log(err);
      })
    })
  }
  service.getENV = function() {
    return new Promise(function(resolve, reject) {
      $http({
        method: "GET",
        url: "/api/env"
      }).then(function(data) {
        if (data) {
          resolve(data);
        } else {
          reject('no data');
        }
      }).catch(function(err) {
        console.log(err);
      })
    })
  }
  return service;
}])

// Access & Manipulate mLabs DB
app.factory("mLabs", ['$http', function($http) {
  return {
    adminAddPasswords: function(schoolcode, pwObj) {
      $http({
        method: "POST",
        url: "/admin-s/add-passwords/" + schoolCode,
        data: { passwords: pwObj }
      })
    },
    loadNewPasswords: function(schoolCode, csv) {
      console.log(csv);
      return new Promise(function(resolve, reject) {
        $http({
          method: "POST",
          url: "/api/" + schoolCode + "/add-passwords",
          data: { csv: csv , schoolCode: schoolCode}
        }).then(function(data) {
          if (data) {
            resolve(data);
          } else {
            console.log('error');
          }
        })
      })
    },
    assignNewPassword: function(schoolCode, respondentData) {
      return new Promise(function(resolve, reject) {
        $http({
          method: "POST",
          url: "/api/" + schoolCode + "/assign-new-password",
          data: { respondentData: respondentData }
        }).then(function(data) {
          if (data) {
            resolve(data);
          } else {
            console.log('error');
          }
        })
      })
    }
  }
}])

// Service for converting school codes to full names and vice versa
app.factory("school_link_conv", ['$http', '$stateParams', function($http, $stateParams) {
  return {
    getFullNameByCode: function(code) {
      return new Promise(function(resolve, reject)  {
        $http({
          method: "GET",
          url: "/school-links-s/get-full-name/" + code
        }).then(function(data) {
          // console.log(data);
          if (data) {
            resolve(data);
          } else {
            reject('no data')
          }
        }).catch(function(err) {
          console.log(err);
        })
      })
    },
    getCodeByFullName: function(fullName) {
      return new Promise(function(resolve, reject) {
        $http({
          method: "GET",
          url: "/school-links-s/get-code/" + fullName
        }).then(function(data) {
          if (data) {
            resolve(data);
          } else {
            reject('no data')
          }
        }).catch(function(err) {
          console.log(err);
        })
      })
    },
  };
}])
