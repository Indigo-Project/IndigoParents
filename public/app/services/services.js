app.factory('TTI_API', ['$http', function($http) {
  var service = {};
  service.createRespondent = function() {
    console.log("create respondent button clicked");
    $http({
      method: 'POST',
      url: 'https://api.ttiadmin.com/',
      headers: {
        "Authorization": "Basic c2hlcmlzbWl0aDpJbmRpZ29GciMj",
        "Content-Type": "application/json"},
      data: {
        "first_name": "paul",
        "last_name": "dziemianowicz",
        "gender": "male",
        "email": "pauldziemianowicz@gmail.com",
        "company": "Indigo Project",
        "position_job": "wizard"
      }
    }).then(function(data) {
      console.log(" --- Create Respondent Post Success --- ");
      console.log(data);
    })
  }
  service.postRespondentToServer = function(data) {
    console.log(data.first_name);
    console.log(JSON.stringify(data));
    $http({
      method: "POST",
      url: "/api/createrespondent",
      data: data,
      headers: {
        "Content-Type": "application/json"
      }
    })
  }
  return service;
}])

app.factory('Mailgun', ['$http', '$location', '$timeout', function($http, $location, $timeout) {
  var service = {};
  service.successfulPurchaseEmail = function() {
    return new Promise(function(resolve, reject) {
        $http({
          method: "GET",
          url: "/mail"
        }).then(function(data) {
        console.log(data.status === 200);
        if(data.status === 200) {
          resolve('/mail url accessed, email sent');
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
