var billing = require('./billing.js');

billing.totalCost(function(err, result) {
  console.log(result)
});