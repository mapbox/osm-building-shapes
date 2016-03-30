'use strict';
var turf = require('turf');
var tilebelt = require('tilebelt');

module.exports = function(tileLayers, tile, writeData, done) {
	var layer = tileLayers.osm.osm;
	var bbox = tilebelt.tileToBBOX(tile);
	var bboxLineString = turf.bboxPolygon(bbox);
	bboxLineString.geometry.type = 'LineString';
	bboxLineString.geometry.coordinates = bboxLineString.geometry.coordinates[0];
	var buffer = turf.buffer(bboxLineString, 10, 'meters').features[0];

	var buildings = layer.features.filter(function(val) {
		if (val.properties.building && val.geometry.type === 'Polygon') {
			var flag = 0;
			console.log(val.geometry.coordinates[0][0]);
			for (var coordinate in val.geometry.coordinates[0][0]) { //throws error
				console.log(coordinate);
				if (turf.inside(turf.point(coordinate), buffer)) {
					flag = 1;
					break;
				}
			}
			if (flag == 0) {
				var props = {
				"_osm_way_id": val.properties._osm_way_id,
				};
		    	//area in m^2
	            props.area = turf.area(val);
                //perimeter in meter
			   	props.perimeter = (turf.lineDistance(val,'kilometers')/0.001);
			   	//para = (perimeter / area )
			   	props.para = ((props.perimeter)/(props.area));
			   	//p2a = (perimeter^2) / (area) http://www.spatialanalysisonline.com/HTML/index.html?shape.htm
			   	props.p2a = ((props.perimeter)*(props.perimeter))/(props.area);
			   	props.sqrt_p2a = Math.sqrt(props.p2a);
			   	// shape factor = (4 * PI * area) / (perimeter^2) http://www.empix.com/NE%20HELP/functions/glossary/morphometric_param.htm
			   	props.shape = (Math.PI * 4 * props.area) / ((props.perimeter)*(props.perimeter));
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
