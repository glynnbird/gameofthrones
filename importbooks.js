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
  request.get("http://www.anapioficeandfire.com/api/books?page=" + page, function(err, res, data) {
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
      for(var j in d.characters) {
        d.characters[j] = stripdomain(d.characters[j]);
      }
      for(var j in d.povCharacters) {
        d.povCharacters[j] = stripdomain(d.povCharacters[j]);
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
