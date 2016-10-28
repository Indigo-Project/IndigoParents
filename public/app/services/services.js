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
    $http({
      method: "POST",
      url: "api/createRespondent",
      data: { school: school, data: data }
    })
  }
  return service;
}])

// Mailgun Service - connect to server-side Moltin API
app.factory('Mailgun', ['$http', '$location', '$timeout', function($http, $location, $timeout) {
  var service = {};
  service.successfulPurchaseEmail = function(formData) {
    return new Promise(function(resolve, reject) {
      $http({
        method: "GET",
        url: "/api/308149BWF/passwords/assign-new"
      }).then(function(data) {
        console.log('mailgun service GET 1', data);
        $http({
          method: "POST",
          url: "/mail",
          data: [formData, data.data.password]
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


// Service for converting school codes to full names and vice versa
app.factory("school_link_conv", ['$http', '$stateParams', function($http, $stateParams) {
  return {
    getFullNameByCode: function(code) {
      return new Promise(function(resolve, reject)  {
        $http({
          method: "GET",
          url: "/school-links-s/get-full-name/" + code
        }).then(function(data) {
          console.log(data);
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
