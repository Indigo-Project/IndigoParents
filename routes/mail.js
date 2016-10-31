var express = require('express');
var request = require('request');
var Mailgun = require('mailgun').Mailgun;
var mongo = require('../database/mongo-db');
var TTI_API = require('../APIs/TTI_API');
var router = express.Router();

var mg = new Mailgun(process.env.MAILGUN_API_KEY);

// sendText(sender, recipients, subject, text, [servername=''], [options={}], [callback(err)])

// sendText(sender, recipients, subject, text, [servername=''], [options={}], [callback(err)])
//
// sender - Sender of the message; this should be a full email address (e.g. example@example.com).
// recipients - A string (example@example.com) or array of strings (['a@example.com', 'b@example.com']) of recipients; these can be email addresses or HTTP URLs.
// subject - Message subject
// text - Message body text
// servername - The name of the Mailgun server. If you only have one server on your Mailgun account, this can be omitted. Otherwise, it should be set to the server you want to send from.
// options - Optional parameters. See Mailgun's API docs for details on these. At the time of writing, the only supported value is headers, which should be a hash of additional MIME headers you want to send.
// callback - Callback to be fired when the email is done being sent. This should take a single parameter, err, that will be set to the status code of the API HTTP response code if the email failed to send; on success, err will be undefined.

router.post('/send', function(req, res, next) {
  console.log('post arrived at /mail');
  var linkId = TTI_API.linkLocations[req.body.schoolCode].mainLink.id
  mg.sendText('IndigoParents@indigoproject.org', req.body.data.email, req.body.data.first_name + ', Access Your Indigo Me Assessment', req.body.data.first_name + ', Here is your link: https://www.ttisurvey.com/' + linkId + ', and password: ' + req.body.data.passwd + ' . Click on the link and enter your password to begin the Indigo Assessment.', {'X-Campaign-Id': 'indigoParents'}
  , function(err) {
    err && console.log(err)
  });
  res.end();
})

module.exports = router;
