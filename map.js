'use strict';
var turf = require('turf');

// Identify Point geometries with a boundary tag.
module.exports = function(tileLayers, tile, writeData, done) {
	var layer = tileLayers.osm.osm;

	var buildings = layer.features.filter(function(val) {
		if (val.properties.building && val.geometry.type === 'Polygon') {
			var coordinates_length = val.geometry.coordinates.length;
			if (val.geometry.coordinates[0] === val.geometry.coordinates[coordinates_length - 1]) {
				val.properties.calc_area = turf.area(val);
				val.properties.calc_perimeter = turf.lineDistance(val);
				return true;
			}
		}
	});

	if (buildings.length > 0) {
		var fc = turf.featurecollection(buildings);
		writeData(JSON.stringify(fc) + '\n');
	}

	done(null, null);
};