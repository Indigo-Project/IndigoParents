var express = require('express');
var router = express.Router();
var path = require('path');
var csv = require('csv');

var mongo = require('../database/mongo-db');
var TTI = require('../APIs/TTI_API');

router.post("/validate-request-endpoint", function(req, res, next) {
  if (req.body.mode === "verify") {
    console.log('verifying...');
    // var listReportsEndpoint = TTI.APIs.listReports.generateEndpoint(req.body.accountID, req.body.linkID);
    // TTI.APIs.requestFormat("GET", listReportsEndpoint, req.body.username, req.body.password)
    // .then(function(reportList1) {
    var showLinkEndpoint = TTI.APIs.showLink.generateEndpoint(req.body.accountID, req.body.linkID);
    console.log('showLinkEndpoint', showLinkEndpoint);
    TTI.APIs.requestFormat("GET", showLinkEndpoint, req.body.username, req.body.password)
    .then(function(linkInfo) {

      console.log('linkInfo', linkInfo);

      // var fixedData = [reportList1.slice(0,133), ",", reportList1.slice(133)].join('');

      // csv.parse(fixedData, function(error, reportList2) {
      //   reportList2.shift();
      //   var reportTypes = [];
      //   var filteredReportList = [];
      //
      //   for (var i = 0; i < reportList2.length; i++) {
      //     var match = false;
      //     if (!reportTypes.length) {
      //       reportTypes.push(reportList2[i][11]);
      //     }
      //     for (var j = 0; j < reportTypes.length; j++) {
      //       if (reportList2[i][11] === reportTypes[j]) {
      //         match = true;
      //       }
      //     }
      //     if (!match) {
      //       reportTypes.push(reportList2[i][11]);
      //     }
      //   }
      // })

      res.send({ linkInfo: JSON.parse(linkInfo) });

    }).catch(function(error) {
      res.send({ error: error });
    })
    // }).catch(function(error) {
    //   res.send({ error: error });
    // })
  }
})

module.exports = router;
