'use strict';
var tileReduce = require('tile-reduce');
var path = require('path');
var turf = require('turf');
var argv = require('minimist')(process.argv.slice(2));

var out = turf.featurecollection([]);
var file = argv.mbtiles;
var bbox = argv.bbox ? JSON.parse(argv.bbox) : null;
var zoom = argv.zoom ? parseInt(argv.zoom) : 12;

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
.on('reduce', function(buildings) {
    Array.prototype.push.apply(out.features, buildings);
})
.on('end', function() {
    process.stdout.write(JSON.stringify(out));
});