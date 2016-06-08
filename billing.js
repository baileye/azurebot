var arm = require('./arm.js');

var costs = {
  "Standard_A1" : {
    "MeterName": "Compute Hours",
    "MeterCategory": "Virtual Machines",
    "MeterSubCategory": "Standard_A1",
    "Unit": "Hours",
    "MeterRate": 2.16,
    "EffectiveDate": "2014-12-01T00:00:00Z",
    "IncludedQuantity": 0
  },
  "Standard_DS1": {
    "MeterName": "Compute Hours",
    "MeterCategory": "Virtual Machines",
    "MeterSubCategory": "Standard_DS1",
    "Unit": "Hours",
    "MeterRate": 0.129,
    "EffectiveDate": "2014-12-01T00:00:00Z",
    "IncludedQuantity": 0
  },
  "Standard_D2_v2": {
    "MeterName": "Compute Hours",
    "MeterCategory": "Virtual Machines",
    "MeterSubCategory": "Standard_D2_v2",
    "Unit": "Hours",
    "MeterRate": 0.16,
    "EffectiveDate": "2014-12-01T00:00:00Z",
    "IncludedQuantity": 0
  },
  "Standard_D1": {
    "MeterName": "Compute Hours",
    "MeterCategory": "Virtual Machines",
    "MeterSubCategory": "Standard_D1",
    "Unit": "Hours",
    "MeterRate": 0.129,
    "EffectiveDate": "2014-12-01T00:00:00Z",
    "IncludedQuantity": 0
  }
}

exports.totalCost = function(callback) {

  $totalAmount = 0;

  arm.login(function() {
    arm.getVMList(function(err, vmList) {  
      if (err) {
        callback(err, null);
        console.log(err);
      } else {
        // name: o.name, location: o.location, size: o.hardwareProfile.vmSize
        for (var vm in vmList) {
          $totalAmount += costs[vmList[vm].size].MeterRate
        }
        callback(null, $totalAmount.toFixed(2));
      }
    })
  })
};