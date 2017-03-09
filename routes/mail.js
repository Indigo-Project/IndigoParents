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

  var linkInstanceData = req.body.linkInstanceData;
  var cart = req.body.cart;

  var schoolName = school_link_conv[req.body.schoolCode].name;
  var parentLinkID = linkInstanceData.parents.TTILinkID;
  var studentLinkID = linkInstanceData.students ? linkInstanceData.students.TTILinkID : null;

  var parentOrderQuantity = cart.parentOrderQuantity;
  var studentOrderQuantity = cart.studentOrderQuantity || 0;

  var totalPasswordCount = parentOrderQuantity + studentOrderQuantity;

  console.log(totalPasswordCount);

  console.log(req.body.data);
  var passwords = req.body.data.passwords;
  var parentPasswords = passwords.parents;
  var studentPasswords = passwords.students;

  var emailParentPasswords = '<ul>';
  for (var i = 0; i < parentPasswords.length; i++) {
    console.log('parentPasswords ' + i, parentPasswords[i]);
    emailParentPasswords += '<li>' + parentPasswords[i] + '</li>';

    // if (i === parentPasswords.length - 1) {
    //   emailParentPasswords += parentPasswords[i] + ", ";
    // } else {
    //   emailParentPasswords += parentPasswords[i];
    // }

  }
  emailParentPasswords += '</ul>';

  var emailStudentSection = '';
  var emailStudentPasswords = '<ul>';

  if (studentOrderQuantity) {

    for (var i = 0; i < studentPasswords.length; i++) {
      console.log('studentPasswords ' + i, studentPasswords[i]);
      emailStudentPasswords += '<li>' + studentPasswords[i] + '</li>';

      // if (i === studentPasswords.length - 1) {
      //   emailStudentPasswords += studentPasswords[i] + ", ";
      // } else {
      //   emailStudentPasswords += studentPasswords[i];
      // }

    }
    emailStudentPasswords += '</ul>';

    emailStudentSection = '<strong>Student Assessments<\/strong><ol><li>Click <a href=\"https://www.ttisurvey.com/' + studentLinkID + '\">Here<\/a> to start the Student Indigo Inventory. It will take approximately 40 minutes to complete and it must be finished in one sitting.<\/li><li>The webpage will prompt you for a password. Please enter one of the following passwords: <br>' + emailStudentPasswords + '<\/li><\/ol>';
  }

  console.log('emailStudentPasswords', emailStudentPasswords);
  console.log('emailParentPasswords', emailParentPasswords);

  var subject = totalPasswordCount > 1 ? req.body.data.firstName + ", Access Your Indigo Assessments" : req.body.data.firstName + ", Access Your Indigo Assessment"
  var emailContent = 'Hello ' + schoolName + ' Parents!,<br><br>Thank you for purchasing the Indigo Inventory.  Indigo Parent Nights create an intentional time where parents and students can learn more about their differences, and how parents can help their kids succeed based on who they are.<br><br><strong>Instructions<\/strong><br>To access the Indigo Inventory, click on the link corresponding to the versions of the assessment you purchased. We’ve included one password for each Inventory purchased, which you will use to access the Inventory once the link is opened.<br><br><strong>Parent Assessments<\/strong><ol><li>Click <a href=\"https://www.ttisurvey.com/' + parentLinkID + '\">Here<\/a> to start the Parent Indigo Inventory. It will take approximately 20 minutes to complete and it must be finished in one sitting.<\/li><li>The webpage will prompt you for a password. Please enter one of the following passwords: <br>' + emailParentPasswords + '<\/li><\/ol>' + emailStudentSection + '<br><br>We hope you enjoy learning more about yourself and your child\'s strengths!<br>- The Indigo Team<br><br><em>“Enlightening. Worth the time and money to help you understand yourself and your child.”<br>- High School Parent (Cincinnati, Ohio)</em><br><br><img style=\"width: 200px;\" src=\"http://p3insights.com/wp-content/uploads/2016/07/download-300x166.png\"> '
  console.log(subject);
  console.log(emailContent);

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
          subject: subject,
        },
      ],
      from: {
        email: 'info@indigoproject.org',
      },
      content: [
        {
          type: 'text/html',
          value: emailContent
          // value: 'Hello ' + schoolName + ' Parents!,<br><br>Thank you for purchasing the Indigo Inventory.  Indigo Parent Nights create an intentional time where parents and students can learn more about their differences, and how parents can help their kids succeed based on who they are.<br><br><strong>Instructions<\/strong><br><ol><li>Click <a href=\"https://www.ttisurvey.com/' + linkId + '\">Here<\/a> to start the Indigo Inventory. It will take approximately<br> 20 minutes to complete and it must be finished in one sitting.<\/li><li>The webpage will prompt you for a password. Please enter this password: ' + req.body.data.password + '<\/li><\/ol>We hope you enjoy learning more about yourself and your child\'s strengths!<br>- The Indigo Team<br><br><em>“Enlightening. Worth the time and money to help you understand yourself and your child.”<br>- High School Parent (Cincinnati, Ohio)</em><br><br><img style=\"width: 200px;\" src=\"http://p3insights.com/wp-content/uploads/2016/07/download-300x166.png\"> '
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
