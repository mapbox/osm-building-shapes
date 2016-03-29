'use strict';
var turf = require('turf');

module.exports = function(tileLayers, tile, writeData, done) {
	var layer = tileLayers.osm.osm;

	var buildings = layer.features.filter(function(val) {
		if (val.properties.building && val.geometry.type === 'Polygon') {
			var coordinates_length = val.geometry.coordinates.length;
			if (val.geometry.coordinates[0] === val.geometry.coordinates[coordinates_length - 1]) {
			    var props = {
				"_osm_way_id": val.properties._osm_way_id,
			
			    };
			    
		            props.area = turf.area(val);
			    props.perimeter = turf.lineDistance(val,'kilometers');
			    props.para = (((props.perimeter)/0.001)/(props.area));
			    val.properties = props
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
