'use strict';
var tileReduce = require('tile-reduce');
var path = require('path');
var turf = require('turf');
var argv = require('minimist')(process.argv.slice(2));

var out = turf.featurecollection([]);
var file = argv.file;
var bbox = JSON.parse(argv.bbox);
var zoom = argv.zoom;

tileReduce({
    bbox: bbox,
    zoom: zoom,
    map: path.join(__dirname, '/map.js'),
    sources: [{
        name: 'osm',
        mbtiles: path.join(__dirname, file),
        raw: false
    }]
})
.on('reduce', function() {})
.on('end', function() {});