// TTI Service - connect to server-side TTI API
app.factory('TTI_API', ['$http', function($http) {
  var service = {};
  // service.showLink = function(accountID, linkID) {
  //   console.log(accountID, linkID);
  //   $http({
  //     method: "POST",
  //     url: "/api/show-link",
  //     data: { accountID: accountID, linkID: linkID }
  //   })
  // }

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

  service.validateTTILink = function(username, password, accountID, linkID, mode) {
    return new Promise(function(resolve, reject) {
      $http({
        method: "POST",
        url: "/TTI-API/validate-request-endpoint",
        data: { username: username, password: password, accountID: accountID, linkID: linkID, mode: mode}
      }).then(function(data) {
        console.log(data);
        resolve(data);
      }).catch(function(error) {
        console.log(error);
        reject(error);
      })
    })
  }

  return service;
}])

// Sendgrid Service - connect to server-side SG API
app.factory('SG', ['$http', '$location', '$timeout', function($http, $location, $timeout) {
  var service = {};
  service.successfulPurchaseEmail = function(data, schoolCode, linkInstanceData, cart) {
    return new Promise(function(resolve, reject) {
      $http({
        method: "POST",
        url: "/mail/send",
        data: { data: data, schoolCode: schoolCode, linkInstanceData: linkInstanceData, cart: cart }
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

app.factory('StripeService', ['$http', function($http){
  var service = {};
  service.submitPurchase = function(token, form, cart, linkInstanceData) {
    return new Promise(function(resolve, reject){
      $http({
        method: "POST",
        url: "/stripe/submit-purchase",
        data: {token: token, form: form, cart: cart, linkInstanceData: linkInstanceData}
      }).then(function(data) {
        console.log(data);
        resolve(data);
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
    getAllTTILinksForSchool: function(schoolCode) {
      return new Promise(function(resolve, reject) {
        $http({
          method: "POST",
          url: "/api/get-all-tti-links-for-school",
          data: { schoolCode: schoolCode}
        }).then(function(data) {
          if (data) {
            resolve(data);
          } else {
            console.log('error');
          }
        })
      });
    },
    loadNewPasswords: function(schoolCode, linkID, csv) {
      console.log(csv);
      return new Promise(function(resolve, reject) {
        $http({
          method: "POST",
          url: "/api/add-passwords",
          data: { schoolCode: schoolCode, linkID: linkID, csv: csv}
        }).then(function(data) {
          if (data) {
            resolve(data);
          } else {
            console.log('error');
          }
        })
      })
    },
    assignNewPassword: function(linkInstanceData, form, cart) {
      return new Promise(function(resolve, reject) {
        $http({
          method: "POST",
          url: "/api/assign-new-password",
          data: { linkInstanceData: linkInstanceData, form: form, cart: cart }
        }).then(function(data) {
          if (data) {
            resolve(data);
          } else {
            console.log('error');
          }
        })
      })
    },
    addNewGeneratedLink: function(linkInfo) {
      return new Promise(function(resolve, reject) {
        $http({
          method: "POST",
          url: "/admin-s/add-generated-link",
          data: { linkInfo: linkInfo }
        }).then(function(data) {
          if (data) {
            console.log('addNewGeneratedLink Service:', data);
            resolve(data);
          } else {
            console.log('error');
          }
        }).catch(function(err) {
          console.log(err);
        })
      })
    },
    getSchoolLinkList: function(schoolCode) {
      return new Promise(function(resolve, reject) {
        $http({
          method: "POST",
          url: "/admin-s/get-school-link-list",
          data: { schoolCode: schoolCode }
        }).then(function(data) {
          if (data) {
            resolve(data);
          } else {
            console.log('error');
          }
        }).catch(function(err) {
          console.log(err);
        })
      })
    },
    retrieveSchoolLinkData: function(schoolCode, linkName) {
      return new Promise(function(resolve, reject) {
        $http({
          method: "POST",
          url: "/admin-s/retrieve-school-link-data",
          data: { schoolCode: schoolCode, linkName: linkName }
        }).then(function(data) {
          if (data) {
            resolve(data);
          } else {
            console.log('error');
          }
        }).catch(function(err) {
          console.log(err);
        })
      });
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
