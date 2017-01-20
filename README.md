# Dem precincts

App allowing people to get info on their democratic precincts

## Prerequisites

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Shapefile parser](https://github.com/mbostock/shapefile)
* [d3-geo-projection](https://github.com/d3/d3-geo-projection)
* [ndjson-cli](https://github.com/mbostock/ndjson-cli)
* [topojson](https://github.com/topojson/topojson)
* [jq](https://stedolan.github.io/jq/)
* [Python 3](http://www.python.org)
* [GDAL](http://www.gdal.org/index.html). To install on Mac OS: `brew install gdal`

## Installation

* `git clone <repository-url>` this repository
* `cd <this repository>`
* `pip install -r requirements.txt`

## Data

### Organization

* `python fetch_precincts_data.py`

### NCBSE

* Data dictionary: `curl https://s3.amazonaws.com/dl.ncsbe.gov/data/ncvhis_ncvoter_data_format.txt -o data/ncvhis_ncvoter_data_format.txt`
* Just Wake county:
	* Voter history: 
		* `curl https://s3.amazonaws.com/dl.ncsbe.gov/data/ncvhis32.zip -o data/ncvhis32.zip`
		* `unzip data/ncvhis32.zip -d data`
	* Voter details: 
		* `curl https://s3.amazonaws.com/dl.ncsbe.gov/data/ncvoter32.zip -o data/ncvoter32.zip`
		* `unzip data/ncvoter32.zip -d data`
* NC-wide:
	* Voter history: 
		* `curl https://s3.amazonaws.com/dl.ncsbe.gov/data/ncvhis_Statewide.zip -o data/ncvhis_Statewide.zip`
		* `unzip data/ncvhis_Statewide.zip -d data`
	* Voter details: 
		* `curl https://s3.amazonaws.com/dl.ncsbe.gov/data/ncvoter_Statewide.zip -o data/ncvoter_Statewide.zip`
		* `unzip data/ncvoter_Statewide.zip -d data`

### Geo

* Download precincts shapefiles: 
	* Just Wake county:
		* `curl ftp://wakeftp.co.wake.nc.us/GIS/WebDownloads/SHAPEFILES/Wake_Precincts_2015_11.zip -o data/Wake_Precincts_2015_11.zip`
		* `unzip data/Wake_Precincts_2015_11.zip -d data`
	* NC-wide:
		* `curl https://s3.amazonaws.com/dl.ncsbe.gov/ShapeFiles/Precinct/SBE_PRECINCTS_20161004.zip -o data/SBE_PRECINCTS_20161004.zip`
		* `unzip data/SBE_PRECINCTS_20161004.zip -d data`
* Quick check of what the shapes look like: go to [mapshaper](mapshaper.org) and drag and drop the shape file `data/Wake_Precincts_2015_11.shp`
* We notice that in the unzipped files, there's a `.prj` file. This file specifies the coordinate system used for the shapefile. It turns out that d3 doesn't know about this coordinate system. So we have to convert it to one more familiar to d3. See [this Stackoverflow answer](http://stackoverflow.com/a/15601953/2081402) for more detailed explanation. So the first step is to convert that coordinate systems: `ogr2ogr data/Wake_Precincts_2015_11-UTM.shp data/Wake_Precincts_2015_11.shp -t_srs "+proj=longlat +ellps=WGS84 +no_defs +towgs84=0,0,0"`
* Convert from shapefile format to geojson format: `shp2json data/Wake_Precincts_2015_11-UTM.shp -o data/wake-precincts.json`
* Apply cartographic projection:
	* Pick a projection: [d3-stateplane](https://github.com/veltman/d3-stateplane)
	* `geoproject 'd3.geoConicConformal().parallels([34 + 20 / 60, 36 + 10 / 60]).rotate([79, -33 - 45 / 60]).fitSize([960,960],d)' < data/wake-precincts.json > data/wake-conformal.json`
* Visual sanity check: 
	* `geo2svg -w 960 -h 960 < data/wake-conformal.json > data/wake-conformal.svg`
	* Open in browser
* Convert from JSON to newline-delimited JSON (NDJSON) to merge with precinct data:
	* `jq -c '.features | .[]' < data/wake-conformal.json > data/wake-conformal.ndjson`
	* `ndjson-join 'd.code' 'd.properties.PRECINCT' data/data.json data/wake-conformal.ndjson > data/wake-join.ndjson`
	* `jq -c '.[1].properties = .[0] | .[1]' data/wake-join.ndjson > data/wake-data.ndjson`
	* `geo2topo -n precincts=data/wake-data.ndjson > data/wake-precincts-topo.json`
	* `toposimplify -p 1 -f < data/wake-precincts-topo.json > data/wake-simple-topo.json`
	* `topoquantize 1e5 < data/wake-simple-topo.json > data/wake-quantized-topo.json`



