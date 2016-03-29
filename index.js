'use strict';
var tileReduce = require('tile-reduce');
var path = require('path');
var turf = require('turf');

var out = turf.featurecollection([]);
tileReduce({
  bbox:[77.6260, 12.9610, 77.6624, 12.9872],
  zoom: 12,
  map: path.join(__dirname, 'map.js'),
  sources: [{
    name: 'osm',
    mbtiles: '/Users/oindrila/mapbox/latest.planet.mbtiles',
    raw: false
  }]
})
.on('reduce', function() {})
.on('end', function() {});

