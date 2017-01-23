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

* Download polling places shapefiles: 
	* `curl ftp://wakeftp.co.wake.nc.us/GIS/Webdownloads/SHAPEFILES/Wake_PollingPlaces_2016_09.zip -o data/Wake_PollingPlaces_2016_09.zip`
	* `unzip data/Wake_PollingPlaces_2016_09.zip -d data`
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

### [Google Civic Information API](https://developers.google.com/civic-information)

This API surfaces data collected through the [Open Civic Data](https://github.com/opencivicdata) project, which standardizes information about elections, governmental divisions, and elected representatives. This may be especially useful for getting info on elected representatives at many different levels, such as:

* State House districts (for state-level House of Representatives elections): `ocd-division/country:us/state:nc/sldl:<id>`
* State Senate districts (for state-level Senate elections): `ocd-division/country:us/state:nc/sldu:<id>`
* Board of Commissioners districts (for county-level Board of Commissioners elections): `ocd-division/country:us/state:nc/county:wake/council_district:<id>`
* Congressional districts: `ocd-division/country:us/state:nc/cd:<id>`
* Court districts: `ocd-division/country:us/state:nc/district_court:<id>`
* School Board districts: `ocd-division/country:us/state:nc/county:wake/school_board_district:<id>`
* Superior Court districts: `ocd-division/country:us/state:nc/superior_court:<id>`
* State: `ocd-division/country:us/state:nc`
* County: `ocd-division/country:us/state:nc/county:wake`
* City: `ocd-division/country:us/state:nc/place:<city>`
* Precincts: `ocd-division/country:us/state:nc/county:wake/precinct:1-01`

The boundaries of these districts do *not* necessary follow precincts boundaries. When it's not the case, that's when we have so-called a *split precincts* situation, which are a normal outcome of the *redistricting* process. 

> [In such split precincts], voters don’t all vote for the same offices. For example, some voters in the precinct might vote for a representative to fill state senate seat A, while other voters, in the same precinct, vote for a representative to fill state senate seat B. Precincts can also be split more than once (once by a concessional district line and once more by a state senate line, for instance). It’s like having multiple precincts in one.
[Source](http://electls.blogs.wm.edu/2012/01/25/va-split-precincts-a-state-divided/)

For a full list of NC precincts OCD division ids go [here](https://github.com/opencivicdata/ocd-division-ids/blob/master/identifiers/country-us/state-nc-precincts.csv).

TODO: Merge geo shape data of all the different voting districts with their OCD division id. That way, when we search by any specific subdivision level, we can use a geo shape query to find with which other subdivisions it intersects, and surface that information as well.

### [Google Geocoding API](https://developers.google.com/maps/documentation/javascript/geocoding)

* Bounding box of Wake county: `[[36.076443, -78.995059], [35.519296, -78.253711]]` ([source](https://www.maptechnica.com/county-map/Wake/NC/37183)). This is useful to restrict geocoding requests to a bounding box in the Google Geocoding API. 

## Search

We want to support two types of search.

### Search by address

Type an address in an input field (with autocomplete feature) and highlight the precinct in which that address falls. In Elasticsearch this translates in a point `geo_shape` query against documents with a `geometry` field indexed as type `geo_shape`. See [this Stackoverflow Q&A](http://stackoverflow.com/questions/31448745/match-a-geoshape-polygon-document-with-a-geopoint-query-in-elasticsearch) for more details.

### Search by person

Type a person's name in an input field (with autocomplete feature) and show information about that person.

### Search by precinct

Return all other governmental subdivisions that intersect with a given precinct. These returned subdivisions should contain their OCD subdivision ids so that we can query the Google Civic Information API. We want to be able to select a precinct and show all the voting districts it intersects with.

## Design

![Sketch](/images/sketch.png)