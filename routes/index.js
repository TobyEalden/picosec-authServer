var express = require('express');
var router = express.Router();
var securityLib = require('picosec-security-experimental');
var tokenStore = require('../tokenStore');
var privateKey = "b3oxBNLHayiMHHTeECs+CrvQDZJhcyeYj/7zzZL4/Ok=";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'authorisation server' });
});

router.get('/tokenDb', function(req, res, next) {
  var store = tokenStore.load();
  var storeArray = Object.keys(store).map(function(i) {
    store[i].capability.resources = Object.keys(store[i].capability.resources).map(function(r) {
      return { resource: r, actions: store[i].capability.resources[r] }
    });
    return store[i];
  });
  res.json(storeArray.filter(function(i) { return i.expires > Date.now(); }));
});

router.get('/tokenDbExpired', function(req, res, next) {
  var store = tokenStore.load();
  var storeArray = Object.keys(store).map(function(i) {
    store[i].capability.resources = Object.keys(store[i].capability.resources).map(function(r) {
      return { resource: r, actions: store[i].capability.resources[r] }
    });
    return store[i];
  });
  res.json(storeArray.filter(function(i) { return i.expires <= Date.now(); }));
});

router.post('/addCapability', function(req, res, next) {
  var subject = req.body.subject;
  var expiry = req.body.expiry;
  var scope = req.body.scope;
  var resources = {};

  try {
    console.log("resources: " + req.body.resources);
    var resourceList = JSON.parse(req.body.resources);
    resourceList.forEach(function(i) {
      resources[i.key] = i.value;
    });
  } catch (e) {
    console.log("failed to parse resources: " + e);
  }

  var capability = {
    $scope: scope,
    resources: resources
  };

  var cap = securityLib.token.Capability.create(scope, resources);
  var encoded = cap.encode();

  var pKey = securityLib.keyexchange.Key.PrivateKey.fromEncoded(privateKey);
  var kp = securityLib.keyexchange.Key.KeyPair.create(pKey);

  var expiresDate = new Date(Date.now() + expiry*60000);
  var options = {
    capability: cap,
    expires: expiresDate.getTime()
  };
  var token = securityLib.token.Token.create(options, kp);
  token.subject = subject;

  var tokenDb = tokenStore.load();
  tokenDb[token.id] = token;
//  tokenDb["publicKey"] = kp.publicKey.getEncoded("base64");
  tokenStore.save(tokenDb);

  res.redirect("/");
});

module.exports = router;
