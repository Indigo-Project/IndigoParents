var request = require('request');
var base64 = require('base-64');


var linkLocations = {

  // Indigo Parents Test Link
  test: {
    auth: "c2hlcmlzbWl0aDpJbmRpZ29GciMj",
    accountID: "SHERISMITH",
    mainLink: {
      name: "Indigo Parents Test",
      id: "308149BWF"
    }
  },
  // test2: {
  //   auth: "c2hlcmlzbWl0aDpJbmRpZ29GciMj",
  //   accountID: "SHERISMITH",
  //   mainLink: {
  //     name: "Indigo Parents Test 2",
  //     id: "312384FTL"
  //   }
  // },

  arete: {
    auth: "",
    accountID: "",
    mainLink: {
      name: "Arete Academy",
      id: ""
    }
  },

  "prospect-ridge": {
    auth: "UFJPU1BFQ1RSSURHRToxMjM0NTY3OA==",
    accountID: "PROSPECTRIDGE",
    mainLink: {
      name: "Prospect Ridge Academy",
      id: "312440JAG"
    }
  }
}

var APIs = {

  // constants
  baseURL: "http://api.ttiadmin.com",

  // Universal API Request Format
  requestFormat: function(method, endpoint, login, password) {
    return new Promise(function(resolve,reject) {
      var encodeString = base64.encode(login + ":" + password);
      var options = {
        method: method,
        url: endpoint,
        headers: {
          'Authorization': 'Basic ' + encodeString,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
      request(options, function(err, httpResponse, body){
        if (err) {
          reject(err);
        } else {
          // console.log(body);
          if (body === '<html><body>You are being <a href="http://api.ttiadmin.com/admin/login?_r=1">redirected</a>.</body></html>') {
            reject("Internal Error: INCORRECT METHOD");
          } else if (body === "HTTP Basic: Access denied.\n") {
            reject("Error: Access Denied,\nPlease Correct Authentication Credentials");
          } else if (body === "Link Not Found") {
            reject("Error: Link Not Found,\nPlease Correct Link ID");
          } else {
            resolve(body);
          }
        }
      })
    })
  },

  // Show Link API
  showLink: {
    generateEndpoint: function(accountID, linkID) {
      return APIs.baseURL + "/api/accounts/" + accountID + "/links/" + linkID + "?include=reportviews";
    }
  },

  // List Respondents API
  listRespondents: {
    generateEndpoint: function(accountID, linkID) {
      return APIs.baseURL + "/api/accounts/" + accountID + "/links/" + linkID + "/respondents.json";
    }
  },

  // Create Respondent API
  createRespondent: {
    generateEndpoint: function(accountID, linkID) {
      return APIs.baseURL + "/api/accounts/" + accountID + "/links/" + linkID + "/respondents";
    }
  }
}

module.exports = {
  APIs,
  linkLocations
}
