# Dem precincts API

This Elasticsearch-powered API provides a variety of endpoints to slice, dice, and combine:

* voter data
* precincts data
* electoral districts data

## Prerequisites

* [GNU Parallel](https://www.gnu.org/software/parallel/): `brew install parallel`

## Prepare data

### Voters

* `python format_voter_data.py`

### Precincts

* `python format_precincts_data.py`
* `jq -c '.features | .[]' < data/wake-precincts.json > data/wake-precincts.ndjson`
* `ndjson-join 'd.code' 'd.properties.PRECINCT' data/precincts_data_formatted.ndjson data/wake-precincts.ndjson > data/wake-precincts-join.ndjson`
* `jq -c '.[0] as $p | .[1] | {geometry} * $p' data/wake-precincts-join.ndjson > data/wake-precincts-data-and-geo.ndjson`

### Subdivisions

* `jq -c '.features | .[] | . as $d | .properties.DISTRICT | tostring as $id | $d | .ocdId = "ocd-division/country:us/state:nc/sldl:" + $id | .ocdType="sldl" | {geometry,ocdId,ocdType}' data/wake-house.json > data/wake-house.ndjson`
* `jq -c '.features | .[] | . as $d | .properties.DISTRICT | tostring as $id | $d | .ocdId = "ocd-division/country:us/state:nc/sldu:" + $id | .ocdType="sldu" | {geometry,ocdId,ocdType}' data/wake-senate.json > data/wake-senate.ndjson`
* `jq -c '.features | .[] | .ocdId = "ocd-division/country:us/state:nc/county:wake/council_district:" + .properties.DISTRICT | .ocdType="council_district" | {geometry,ocdId,ocdType}' data/wake-commissioners.json > data/wake-commissioners.ndjson`
* `jq -c '.features | .[] | .ocdId = "ocd-division/country:us/state:nc/cd:" + .properties.DISTRICT | .ocdType="cd" | {geometry,ocdId,ocdType}' data/wake-congress.json > data/wake-congress.ndjson`
* `jq -c '.features | .[] | .ocdId = "ocd-division/country:us/state:nc/superior_court:" + .properties.District | .ocdType="superior_court" | {geometry,ocdId,ocdType}' data/wake-superior.json > data/wake-superior.ndjson`

## Load ES

1. Set up ES index: `curl -XPUT localhost:9200/fellow -d @api/esconfig.json`
2. Prepare request:
	* `jq -c '{ index: { _index: "fellow", _type: "voter", _id: .regNum } },.' data/ncvoter92.ndjson > data/requests`
	* `jq -c '{ index: { _index: "fellow", _type: "precinct", _id: .ocdId } },.' data/wake-precincts-data-and-geo.ndjson >> data/requests`
	* `jq -c '{ index: { _index: "fellow", _type: "subdivision", _id: .ocdId } },.' data/wake-house.ndjson data/wake-senate.ndjson data/wake-commissioners.ndjson data/wake-congress.ndjson data/wake-superior.json >> data/requests`
3. Load: `cat data/requests | parallel --pipe -N1000 'curl -s -XPOST localhost:9200/_bulk --data-binary @-' >> data/bulk_results`