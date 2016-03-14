function (doc) {
  
  function indexArray(name, arr, opts) {
    for (var i in arr) {
      index(name, arr[i], opts);
    }
  }
  
  function indexString(name, str, opts) {
    if (str && str.length>0) {
      index(name, str, opts);
    }
  }
  var id = doc._id;
  var type = id.split(":")[0];
  indexString("type", type, {facet: true});
  if (type=="characters") {
    indexString("name", doc.name, {});
    indexString("gender", doc.gender, {facet:true});
    indexArray("aliases", doc.aliases, {});
    indexArray("titles", doc.titles, {});
    indexArray("allegiances", doc.allegiances, {facet: true});
    indexString("father", doc.father, {});
    indexString("mother", doc.mother, {});
    indexString("spouse", doc.spouse, {});
    indexString("playedBy", doc.playedBy, {});
    indexArray("tvSeries", doc.tvSeries, {facet: true});
    indexArray("books", doc.books, {facet:true});
    indexString("culture", doc.culture, {facet:true});
  }
}