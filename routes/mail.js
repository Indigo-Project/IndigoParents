var express = require('express');
var request = require('request');
// var Mailgun = require('mailgun').Mailgun;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var school_link_conv = require("../APIs/school_link_conv");
var mongo = require('../database/mongo-db');
var TTI_API = require('../APIs/TTI_API');
var router = express.Router();

// var mg = new Mailgun(process.env.MAILGUN_API_KEY);

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

// router.post('/send', function(req, res, next) {
//   console.log('post arrived at /mail');
//   var linkId = TTI_API.linkLocations[req.body.schoolCode].mainLink.id
//   mg.sendText('IndigoParents@indigoproject.org', req.body.data.email, req.body.data.first_name + ', Access Your Indigo Me Assessment', req.body.data.first_name + ', Here is your link: https://www.ttisurvey.com/' + linkId + ', and password: ' + req.body.data.passwd + ' . Click on the link and enter your password to begin the Indigo Assessment.', {'X-Campaign-Id': 'indigoParents'}
//   , function(err) {
//     err && console.log(err)
//   });
//   res.end();
// })

router.post('/send', function(req, res, next) {
  console.log(req.body.schoolCode);
  var schoolName = school_link_conv[req.body.schoolCode].name;
  console.log(schoolName);
  var linkId = TTI_API.linkLocations[req.body.schoolCode].mainLink.id
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: req.body.data.email,
            },
          ],
          subject: req.body.data.first_name + ", Access Your Indigo Me Assessment",
        },
      ],
      from: {
        email: 'IndigoParents@indigoproject.org',
      },
      content: [
        {
          type: 'text/html',
          value: 'Hello ' + schoolName + ' Parents!,<br><br>Thank you for purchasing the Indigo Inventory.  Indigo Parent Nights create an intentional time where parents and students can learn more about their differences, and how parents can help their kids succeed based on who they are.<br><br><strong>Instructions<\/strong><br><ol><li>Click <a href=\"https://www.ttisurvey.com/' + linkId + '\">Here<\/a> to start the Indigo Inventory. It will take approximately<br> 20 minutes to complete and it must be finished in one sitting.<\/li><li>The webpage will prompt you for a password. Please enter this password: ' + req.body.data.password + '<\/li><\/ol>We hope you enjoy learning more about yourself and your child\'s strengths!<br>- The Indigo Team<br><br><em>“Enlightening. Worth the time and money to help you understand yourself and your child.”<br>- High School Parent (Cincinnati, Ohio)</em><br><br><img style=\"width: 200px;\" src=\"http://p3insights.com/wp-content/uploads/2016/07/download-300x166.png\"> '
          // req.body.data.first_name + ', Here is your assessment. <a href=\"https://www.ttisurvey.com/' + linkId + '\">Click Here<\/a> and enter the following password: ' + req.body.data.password,
        },
      ],
    },
  });
  sg.API(request, function(error, response) {
  if (error) {
    console.log('Error response received');
  }
  console.log(response.statusCode);
  console.log(response.body);
  console.log(response.headers);
  });
  // mg.sendText('IndigoParents@indigoproject.org', req.body.data.email, req.body.data.first_name + ', Access Your Indigo Me Assessment', req.body.data.first_name + ', Here is your link: https://www.ttisurvey.com/' + linkId + ', and password: ' + req.body.data.passwd + ' . Click on the link and enter your password to begin the Indigo Assessment.', {'X-Campaign-Id': 'indigoParents'}
  // , function(err) {
  //   err && console.log(err)
  // });
  res.end();
})

module.exports = router;
