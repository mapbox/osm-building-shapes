#!/usr/bin/env bash                                                                                                                                        
locale
 
DATA=/data/bldg_shapes
token=

# "Install tippecanoe dependencies"
apt-get install  -y libprotobuf-dev protobuf-compiler libsqlite3-dev
git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
git checkout tags/1.4.2
make
make install

# install mapbox-upload
npm install --global mapbox-upload

git clone https://github.com/batpad/merge-geojson

# install deps
npm install

# Download qa tiles
echo "# Downloading planet..."
aws s3 cp s3://mapbox/osm-qa-tiles/latest.planet.mbtiles.gz $DATA/

# run shape index

# US
node index.js --bbox="[-125.60, 23.73, -65.74, 49.15]" --zoom=12 --file=$DATA/latest.planet.mbtiles > $DATA/us.geojson
python merge-geojson/mergeOutputs.py $DATA/us.geojson > $DATA/us.final.geojson

# In
node index.js --bbox="[68.73,7.36,68.88.68,32.25]" --zoom=12 --file=$DATA/latest.planet.mbtiles > $DATA/in.geojson
python merge-geojson/mergeOutputs.py $DATA/in.geojson > $DATA/in.final.geojson

# Global
node index.js --bbox="[67.830,5.572,91.692,21.392]" --zoom=12 --file=$DATA/latest.planet.mbtiles  | /
tippecanoe -l osm -o $DATA/bldg_shapes.mbtiles -z12 -Z12 -pscfkr


# upload to mapbox tileset
export MapboxAccessToken=$token
mapbox-upload maning.bldg_shapes $DATA/bldg_shapes.mbtiles
