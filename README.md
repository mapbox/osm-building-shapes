# osm-building-shapes

Tile Reduce processor to find area, perimeter and a score that defines the shape of the building.
Shape is defined as `(4 * PI * area) / (perimeter^2)` as [here](http://www.empix.com/NE%20HELP/functions/glossary/morphometric_param.htm).

#### Usage
* `npm install`
* Download [OSM QA Tiles](osmlab.github.io/osm-qa-tiles/).
* `node index.js [--bbox --zoom] --mbtiles path-to-mbtiles`

The output is line delimited FeatureCollection with properties:

```
"properties": {"building": "yes", "perimeter": 0, "shape": null, "_osm_way_id": 143251631, "area": 0.042}}
```