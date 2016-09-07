var express = require('express');
var request = require('request');
var Mailgun = require('mailgun').Mailgun;
var mongo = require('../database/mongo-db');
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

router.get('/', function(req, res, next) {
  mg.sendText('parents@indigoproject.org', 'pauldziemianowicz@gmail.com', 'Access Your Indigo Me Assessment', 'Here is the link and password', {'X-Campaign-Id': 'indigoParents'}, function(err) { err && console.log(err) });
  res.send('email sent ' + process.env.MAILGUN_API_KEY);
})

module.exports = router;
