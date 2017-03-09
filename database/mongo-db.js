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
  addPassword: function(db, schoolCode, linkID, addToDBObj) {

    // Access the linkPasswords collection
    var collection = db.collection(schoolCode + "Passwords_" + linkID);
    collection.insert(addToDBObj)
  },

  getAllPasswordsByLink: function(db, schoolCode, linkID) {

    return new Promise(function(resolve, reject) {
      var linkCollection = schoolCode + "Passwords_" + linkID;
      var workingCollection;
      db.collection(linkCollection, {strict: true}, function(err, collection) {
        if (err) {
          if (err.message === 'Collection ' + linkCollection + ' does not exist. Currently in strict mode.') {
            // console.log(linkCollection + ' collection does not exist. Create ' + linkCollection + ' collection');
            db.createCollection(linkCollection, function(err, collection) {
              workingCollection = collection;
              // console.log('recently created collection', workingCollection);
              if (workingCollection) {
                workingCollection.find().toArray(function(err, docs) {
                  if (err) {
                    console.log(err);
                  } else {
                    resolve(docs);
                  }
                })
              }
            })
          } else {
            console.log(err);
            // console.log('unidentified error - no collection created. check logs');
            reject();
          }
        } else {
          collection.find().toArray(function(err, docs) {
            if (err) {
              console.log(err);
            } else {
              resolve(docs);
            }
          })
        }
      })

    });

    // Access the linkPasswords collection
    // var cursor = db.collection(schoolCode + linkID + "Passwords").find();
    // return cursor.toArray();

  },

  getAllTTILinksForSchool: function(db, schoolCode) {
    return new Promise(function(resolve, reject) {

      var linkCollection = schoolCode + 'Links';
      var linkArr = [];

      db.collection(linkCollection, function(err, collection) {
        if (err) {
          console.log(err);
        } else {

          collection.find().toArray(function(err, docs) {

            for (var i = 0; i < docs.length; i++) {

              var parentLink = docs[i].parents.TTIlinkID;
              var studentLink = docs[i].students ? docs[i].students.TTIlinkID : null;

              var pLinkExists = false;
              var sLinkExists = false;

              for (var j = 0; j < linkArr.length; j++) {
                if (parentLink === linkArr[j]) {
                  pLinkExists = true;
                }
                if (studentLink) {
                  if (studentLink === linkArr[j]) {
                    sLinkExists = true;
                  }
                }
              }

              !pLinkExists ? linkArr.push(parentLink) : null;
              !sLinkExists && studentLink ? linkArr.push(studentLink) : null;

            }

            resolve(linkArr);

          })

        }
      })

    });

  },

  assignPassword: function(db, schoolCode, linkID, data) {

    return new Promise(function(resolve, reject) {
      // console.log("mlabsData:", data);
      var collection = db.collection(schoolCode + "Passwords_" + linkID);
      collection.updateOne({password: data.pw}, {$set: {assigned: true, first_name: data.first_name, last_name: data.last_name, email: data.email }}, function(err, result) {
        assert.equal(null, err);
        resolve({result: result, password: data.pw});
      })
    })
  },

  addGeneratedLink: function(db, linkInfo) {
    return new Promise(function(resolve, reject) {
      var linkCollection = linkInfo.schoolCode + 'Links';
      var linkName = linkInfo.name;

      // Access collection. If collection does not exist, create it and access it.
      function enterCollection() {
        return new Promise(function(resolve, reject) {

          var workingCollection;
          db.collection(linkCollection, {strict: true}, function(err, collection) {
            if (err) {
              if (err.message === 'Collection ' + linkCollection + ' does not exist. Currently in strict mode.') {
                // console.log(linkCollection + ' collection does not exist. Create ' + linkCollection + ' collection');
                db.createCollection(linkCollection, function(err, collection) {
                  workingCollection = collection;
                  // console.log('recently created collection', workingCollection);
                  if (workingCollection) resolve(workingCollection);
                })
              } else {
                // console.log('unidentified error - no collection created. check logs');
                reject();
              }
            }
            else {
              workingCollection = collection;
              // console.log(linkCollection + ' collection exists', workingCollection);
              if (workingCollection) resolve(workingCollection);
            }
          });
        })
      }

      enterCollection()
      .then(function(workingCollection) {

        workingCollection.find().toArray(function(err, docs) {
          if (err) {
            console.log(err);
          } else {

            var nameAlreadyExists = false;

            for (var i = 0; i < docs.length; i++) {
              console.log(docs[i].name, linkName);
              if (docs[i].name === linkName) {
                console.log('LINK EXISTS');
                nameAlreadyExists = true;
                break;
              }
            }

            console.log('nameAlreadyExists', nameAlreadyExists);
            // If name already exists, send message to client & do not add to database
            if (nameAlreadyExists) {
              console.log('Inside nameAlreadyExists', nameAlreadyExists);
              resolve({status: 'name already exists'});

            // If name does not already exists, add to database
            } else {
              workingCollection.insertOne(linkInfo, function(err, result) {
                if (err) {
                  console.log(err);
                } else {
                  // console.log(result);
                  resolve({status: 'Success'});
                }
              })
            }

          }
        })

      })
    })
  },

  getSchoolLinkList: function(db, schoolCode) {
    return new Promise(function(resolve, reject) {
      var collection = schoolCode + 'Links';

      db.collection(collection, function(err, collection) {
        if (err) {
          console.log(err);
        } else {
          collection.find().toArray(function(err, docs) {
            if (err) {
              console.log(err);
            } else if (!docs.length) {
              console.log('empty collection');
              resolve({status: 'empty collection'})
            } else {
              console.log('docs', docs);
              resolve({status: 'populated', docs: docs})
            }
          });
        }
      })

    });
  },

  retrieveSchoolLinkData: function(db, schoolCode, linkName) {
    return new Promise(function(resolve, reject) {
      var collection = schoolCode + 'Links';

      db.collection(collection, function(err, collection) {
        if (err) {
          console.log(err);
        } else {
          collection.findOne({name: linkName}, function(err, link) {
            if (err) {
              console.log(err);
            } else if (!link) {
              console.log('no link of name ' + linkName + ' found');
              resolve({status: 'link not found'})
            } else {
              console.log('link', link);
              resolve({status: 'link found', link: link})
            }
          });
        }
      })

    });
  }

}

module.exports = database;
