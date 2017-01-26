# Dem precincts API

This Elasticsearch-powered API provides a variety of endpoints to slice, dice, and combine:

* voter data
* precincts data
* electoral districts data

## Prepare data

* `python format_precincts_data.py`
* `jq -c '.features | .[]' < data/wake-precincts.json > data/wake-precincts.ndjson`
* `ndjson-join 'd.code' 'd.properties.PRECINCT' data/precincts_data_formatted.ndjson data/wake-precincts.ndjson > data/wake-precincts-join.ndjson`
* `jq -c '.[0] as $p | .[1] | {geometry} * $p' data/wake-precincts-join.ndjson > data/wake-precincts-data-and-geo.ndjson`

## Load ES

* `jq -c '{ index: { _index: "fellow", _type: "subdivision", _id: .ocdId } },.' data/wake-precincts-data-and-geo.ndjson > requests`
* `curl -s -XPOST localhost:9200/_bulk --data-binary "@requests"`