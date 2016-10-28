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
  caprock: {
    auth: "Q0FQUk9DS0FDQURFTVk6MTIzNDU2Nzg=",
    accountID: "CAPROCKACADEMY",
    mainLink: {
      name: "Caprock Academy",
      id: ""
    }
  }
}

var APIs = {

  // constants
  baseURL: "http://api.ttiadmin.com",

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
