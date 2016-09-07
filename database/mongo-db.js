require('dotenv').config();

var MongoClient = require('mongodb').MongoClient
, assert = require('assert');

var database = {

  // Indigo Parents Connection URI
  indigoParentsURI: {
    URI: process.env.MONGODB_PARENTS_URI,
    name: 'indigoparents'
  },
  // Indigo Test Connection URI
  indigoTestURI: {
    URI: process.env.MONGODB_TEST_URI,
    name: 'indigotest'
  },

  // Establish connection to Mongo Database
  mongoDBConnect: function(url) {
    return new Promise(function(resolve,reject) {
      MongoClient.connect(url.URI, function(err, db) {
        if(assert.equal(null, err) === undefined) {
          // console.log(db);
          resolve({
            message: "Connected successfully to " + db.databaseName + " mLabs MongoDB server",
            db: db
          })
        } else {
          reject("Failed to connect to " + db.databaseName + " mLabs MongoDB server");
        }
      });
    })
  },

  // Disconnect from Database
  mongoDBDisconnect: function(db) {
    db.close();
    console.log('disconnected from ' + db.databaseName);
  },

  // add new respondent to database
  newRespondent: function(db, respondentData) {
    return new Promise(function(resolve, reject) {

      // Get the respondents collection
      var collection = db.collection('respondentData');
      // Insert a respondent
      collection.insertOne(respondentData, function(err, result) {
        console.log(result);
        if (assert.equal(err, null) === undefined) {
          resolve({
            message: "added new respondent to resondentData collection",
            result: result
          })
        } else {
          reject("Failed to add document to collection");
        }
      });
    })
  },

  // Add fresh passwords to a Particular Link
  addPasswords: function(db, link) {

    // Access the respondentPasswords collection
    var collection = db.collection('respondentPasswords');
  },

  getUnassignedPasswordsByLink: function(db, link) {

    // Access the respondentPasswords collection
    var cursor = db.collection('respondentPasswords').find();
    return cursor.toArray();
  }
}

module.exports = database;
