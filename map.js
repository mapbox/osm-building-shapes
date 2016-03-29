'use strict';
var turf = require('turf');

// Identify Point geometries with a boundary tag.
module.exports = function(tileLayers, tile, writeData, done) {
  var layer = tileLayers.osm.osm;

  var buildings = layer.features.filter(function(val) {
    if (val.properties.building && val.geometry.type === 'Polygon') {
      return true;
    }
  });

  var fc = turf.featurecollection(buildings);

  done(null, fc);
};

