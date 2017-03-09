require('dotenv').config();
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// app level server-routes (var declaration)
var admin = require('./routes/admin-s');
var api = require('./routes/api');
var mail = require('./routes/mail');
var TTI_API = require('./routes/TTI_API');
var stripe = require('./routes/stripe');

// school specific server-routes (var declaration)
var schoolLinks = require('./routes/school-links-s');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// reroute url parameters of angular ui-router routes
app.use("/api-test", express.static(__dirname + "/public/index.html"));
app.use("/products", express.static(__dirname + "/public/index.html"));
app.use("/cart", express.static(__dirname + "/public/index.html"));
app.use("/checkout", express.static(__dirname + "/public/index.html"));
app.use("/success", express.static(__dirname + "/public/index.html"));
app.use("/admin", express.static(__dirname + "/public/index.html"));
app.use("/admin/portal/default", express.static(__dirname + "/public/index.html"));
app.use("/admin/portal/addpasswords", express.static(__dirname + "/public/index.html"));
app.use("/admin/portal/generatelink", express.static(__dirname + "/public/index.html"));
app.use("/school-links/:schoolCode/:linkName", express.static(__dirname + "/public/index.html"));

// app level server-routes (app implementation)
app.use('/admin-s', admin);
app.use('/api', api);
app.use('/mail', mail);
app.use('/TTI-API', TTI_API);
app.use('/stripe', stripe);

// school specific server-routes (app implementation)
app.use('/school-links-s', schoolLinks);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;
