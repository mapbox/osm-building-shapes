'use strict';
var tileReduce = require('tile-reduce');
var path = require('path');
var turf = require('turf');

var out = turf.featurecollection([]);
tileReduce({
  bbox:[77.5079, 12.9042, 77.7049, 13.0507],
  zoom: 12,
  map: path.join(__dirname, 'map.js'),
  sources: [{
    name: 'osm',
    mbtiles: '/Users/oindrila/mapbox/latest.planet.mbtiles',
    raw: false
  }]
})
.on('reduce', function(data) {
  out.features = out.features.concat(data.features);
})
.on('end', function() {
  console.log(JSON.stringify(out));
});

