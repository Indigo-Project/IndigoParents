var moltin = require('moltin')({
  publicId: process.env.MOLTIN_CLIENT_ID,
  secretKey: process.env.MOLTIN_SECRET
});

moltin.Authenticate(function() {
  // do work here
});
