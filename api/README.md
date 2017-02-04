# Dem precincts API

This Elasticsearch-powered API provides a variety of endpoints to slice, dice, and combine:

* voter data
* precincts data
* electoral districts data

This API follows the [JSON API](http://jsonapi.org/) specification and conventions.

## Prerequisites

* [GNU Parallel](https://www.gnu.org/software/parallel/): `brew install parallel`

## Prepare data

### Voters

* `python format_voter_data.py`

### Precincts

```
python format_precincts_data.py
jq -c '.features | .[]' < data/wake-precincts.json > data/wake-precincts.ndjson
ndjson-join 'd.code' 'd.properties.PRECINCT' data/precincts_data_formatted.ndjson data/wake-precincts.ndjson > data/wake-precincts-join.ndjson
jq -c '.[0] as $p | .[1] | {geometry} * $p' data/wake-precincts-join.ndjson > data/wake-precincts-data-and-geo.ndjson
```

### Subdivisions

#### Shapes

* `jq -c '.features | .[] | . as $d | .properties.DISTRICT | tostring as $id | $d | .id="ocd-division/country:us/state:nc/sldl:" + $id | .["ocd-type"]="sldl" | {geometry,"ocd-type",id}' data/wake-house.json > data/wake-house.ndjson`
* `jq -c '.features | .[] | . as $d | .properties.DISTRICT | tostring as $id | $d | .id="ocd-division/country:us/state:nc/sldu:" + $id | .["ocd-type"]="sldu" | {geometry,"ocd-type",id}' data/wake-senate.json > data/wake-senate.ndjson`
* `jq -c '.features | .[] | .id="ocd-division/country:us/state:nc/county:wake/council_district:" + .properties.DISTRICT | .["ocd-type"]="council_district" | {geometry,"ocd-type",id}' data/wake-commissioners.json > data/wake-commissioners.ndjson`
* `jq -c '.features | .[] | .id="ocd-division/country:us/state:nc/cd:" + .properties.DISTRICT | .["ocd-type"]="cd" | {geometry,"ocd-type",id}' data/wake-congress.json > data/wake-congress.ndjson`
* `jq -c '.features | .[] | .id="ocd-division/country:us/state:nc/superior_court:" + .properties.District | .["ocd-type"]="superior_court" | {geometry,"ocd-type",id}' data/wake-superior.json > data/wake-superior.ndjson`
* `find data -name 'wake-*.ndjson' | grep -E 'house|senate|commissioners|congress|superior' | xargs cat > data/wake-shapes.ndjson`

#### Representatives

* `find data -name 'wake-*.ndjson' | grep -E 'house|senate|commissioners|congress' | xargs jq -r '.["ocd-id"]' | sed 's/\//%2F/g;s/\:/%3A/g' | parallel -I {} curl -s https://www.googleapis.com/civicinfo/v2/representatives/{}?key=API_KEY | jq -c '.' > data/ocd-data.ndjson`
* `cat data/ocd-data.ndjson | jq -cr '.officials as $officials | .offices | .[] | .officials=[.officialIndices | .[] | $officials[.]] | {name,divisionId,levels,roles,officials}' > data/ocd.ndjson`
* `ndjson-join 'd.divisionId' 'd.id' data/ocd.ndjson data/wake-shapes.ndjson | jq -cr '.[1].properties=.[0] | .[1] | del(.properties.divisionId)' > data/wake-subdivisions.ndjson`

## Load ES

1. Set up ES index: `curl -XPUT localhost:9200/fellow -d @api/esconfig.json`

2. Prepare request:

	* `jq -c '{ index: { _index: "fellow", _type: "voter", _id: .["reg-num"] } },.' data/ncvoter92.ndjson > data/requests`
	* `jq -c '{ index: { _index: "fellow", _type: "precinct", _id: .code } },.' data/wake-precincts-data-and-geo.ndjson >> data/requests`
	* `jq -c '{ index: { _index: "fellow", _type: "subdivision", _id: .id } },.' data/wake-subdivisions.ndjson >> data/requests`

3. Load: `cat data/requests | parallel --pipe -N1000 'curl -s -XPOST localhost:9200/_bulk --data-binary @-' >> data/bulk_results`

## Endpoints

All endpoints prefixed by `/api`.

### GET /voters

* Request:
	* Query params:
		* precinct_id

* Response:

```
{
	"meta": {
		"total",
		"aggregations": {
			"ages": [
				{
					"doc_count",
					"key"
				}
			],
			"genders": [
				{
					"doc_count",
					"key"
				}
			],
			"races": [
				{
					"doc_count",
					"key"
				}
			],
			"ethnicities": [
				{
					"doc_count",
					"key"
				}
			],
			"parties": [
				{
					"doc_count",
					"key"
				}
			],
			"registrations": [
				{
					"doc_count",
					"key",
					"key_as_string"
				}
			]
		}
	},
	"data": [
		{
			"id"
			"type"
			"attributes": {
				"address",
				"age",
				"birth-state",
				"boe",
				"cong",
				"council",
				"county",
				"drivers-lic",
				"ethnicity",
				"gender",
				"house",
				"judic",
				"municipality",
				"name",
				"party",
				"precinct",
				"race",
				"reg-num",
				"registration-date",
				"senate",
				"status",
				"super-court",
				"ward"
			}
		}
	]
}
```

### GET /precincts

* Response:

```
{
	"meta": {
		"total"
	},
	"data": [
		{
			"id",
			"type",
			"attributes": {
				"chair",
				"code",
				"county-name",
				"district",
				"events",
				"geometry",
				"ocd-id",
				"ocd-type",
				"organization-status",
				"polling-place",
				"secretary",
				"vice-chair"
			}
		}
	]
}
```

### GET /precincts/:precinct_id

* Response:

```
{
	"data": {
		"id",
		"type",
		"attributes": {
			"ages",
			"chair",
			"code",
			"county-name",
			"district",
			"ethnicities",
			"events",
			"genders",
			"geometry",
			"ocd-id",
			"ocd-type",
			"organization-status",
			"parties",
			"polling-place",
			"races",
			"registrations",
			"secretary",
			"vice-chair"
		}
	}
}
```

### GET /subdivisions

* Response:

```
{
	"meta": {
		"total"
	},
	"data": [
		{
			"id",
			"type",
			"attributes": {
				"geometry",
				"ocd-type",
				"properties"
			}
		}
	]
}
```