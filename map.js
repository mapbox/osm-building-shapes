'use strict';
var turf = require('turf');
var tilebelt = require('tilebelt');


module.exports = function(tileLayers, tile, writeData, done) {
    var layer = tileLayers.osm.osm;
    var bbox = tilebelt.tileToBBOX(tile);
    var bboxLineString = turf.bboxPolygon(bbox);
    bboxLineString.geometry.type = 'LineString';
    bboxLineString.geometry.coordinates = bboxLineString.geometry.coordinates[0];
    var buffer = turf.featurecollection(turf.buffer(bboxLineString, 5, 'meters').features[0]);

    var buildings = layer.features.filter(function(val) {
        if (val.properties.building && val.geometry.type === 'Polygon') {
            var flag = 0;
            var buildingPoints = turf.explode(val);
            var pointsWithin = turf.within(buildingPoints, buffer);
            if (!pointsWithin.features.length) {
                var props = {
                    "_osm_way_id": val.properties._osm_way_id,
                    "building": val.properties.building,
                };

                //area in m^2
                props.area = parseFloat((turf.area(val)).toFixed(3));

                // perimeter in meter
                var line = val;
                line.geometry.type = 'LineString';
                line.geometry.coordinates = line.geometry.coordinates[0];

                props.perimeter = parseFloat(((turf.lineDistance(val,'kilometers') * 1000)).toFixed(3));
                process.stderr.write(String(props.perimeter) + '\n');

                // shape factor = (4 * PI * area) / (perimeter^2) http://www.empix.com/NE%20HELP/functions/glossary/morphometric_param.htm
                props.shape = parseFloat(((((Math.PI * 4 * props.area) / ((props.perimeter)*(props.perimeter))) * 100)).toFixed(3));
                val.properties = props;
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
