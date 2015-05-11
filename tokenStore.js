/**
 * Created by toby on 10/05/15.
 */
(function() {
  var fs = require("fs");
  var filePath = "./tokenStore.json";

  function load() {
    var store = {};
    if (fs.existsSync(filePath)) {
      var d = fs.readFileSync(filePath);
      try {
        store = JSON.parse(d);
      } catch (e) {
        console.log("failed to parse json store: " + e);
      }
    }
    return store;
  }

  function save(store) {
    fs.writeFileSync(filePath, JSON.stringify(store,null,2));
  }

  module.exports = {
    load: load,
    save: save
  }
})();