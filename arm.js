var msRestAzure = require('ms-rest-azure');
var computeManagementClient = require('azure-arm-compute');

// Authentication stuff
var clientId = "xxxx";
var tenandId = "xxxx";
var secret = "xxxx";
var subId = "xxxx";

var _credentials;
var _client;

exports.login = function(callback) {
  msRestAzure.loginWithServicePrincipalSecret(clientId, secret, tenandId, function(err, credentials) {
    if (err) callback(err);
    _credentials = credentials;
    _client = new computeManagementClient(credentials, subId);
    callback();
  });
}

exports.getVMList = function(callback) {
  _client.virtualMachines.listAll(function(err, result, request, response) {
    if (err) callback(err);
    var vmList = result.map(function(o) {
      callback(null, { name: o.name, location: o.location, size: o.hardwareProfile.vmSize });
    });
  });
}

exports.getBearerToken = function(callback) {
  _credentials.getToken(function(err, result) {
    callback(err, result);
  });  
}
