var linkLocations = {

  // Indigo Parents Test Link
  indigoParentsTest: {
    accountID: 'SHERISMITH',
    mainLink: {
      name: "Indigo Parents Test",
      id: "308149BWF"
    }
  }
}

var APIs = {

  // constants
  baseURL: "http://api.ttiadmin.com.",

  // List Respondent API
  listRespondents: {
    generateEndpoint: function(accountID, linkID) {
      return APIs.baseURL + "/api/accounts/" + accountID + "/links/" + linkID + "/respondents";
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
