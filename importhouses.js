var request = require('request');
var async = require('async');
if (!process.env.COUCH_URL) {
  throw("environment variable COUCH_URL required");
}
var couchdb = require('cloudant')(process.env.COUCH_URL);
var db = couchdb.db.use('gameofthrones');
var stripdomain = function(str) {
  return str.replace("http://www.anapioficeandfire.com/api/","").replace("/",":");
}

var getPage = function(page, callback) {
  request.get("http://www.anapioficeandfire.com/api/houses?page=" + page, function(err, res, data) {
    if (err) {
      return callback(err, null);
    }
    data = JSON.parse(data);
    if(data.length==0) {
      return callback(true, null);
    }
    for(var i in data) {
      var d = data[i];
      d._id = stripdomain(d.url);
      delete d.url;
      d.currentLord = stripdomain(d.currentLord);
      d.heir = stripdomain(d.heir);
      d.overlord = stripdomain(d.overlord);
      d.founder = stripdomain(d.founder);
      for(var j in d.cadetBranches) {
        d.cadetBranches[j] = stripdomain(d.cadetBranches[j]);
      }
      for(var j in d.swornMembers) {
        d.swornMembers[j] = stripdomain(d.swornMembers[j]);
      }
    }
    db.bulk({docs: data}, function(err, reply) {
      callback(null, reply);
    });
  
  });
}

var page = 1;
var errorCode= null;

async.doUntil(function(done) {
  console.log("Page", page);
  getPage(page++, function(e, d) {
    errorCode = e;
    done();
  })
}, function() {
  return errorCode != null;
}, function() {
  console.log("Done")
});
