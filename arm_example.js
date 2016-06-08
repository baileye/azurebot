var arm = require('./arm.js');

arm.login(function() {
  console.log('login OK');

  // Get Bearer token
  arm.getBearerToken(function(err, res) {
    if (err)
      console.log(err);
    else
      console.log('token=' + res.accessToken);
  });

  // Get list of all VMs
  arm.getVMList(function(err, res) {
    if (err)
      console.log(err);
    else
      console.log(res);
  });
});
