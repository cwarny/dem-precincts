# fellow

App allowing people to get info on their democratic precincts

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd <this repository>`
* `npm install`
* `bower install`
* [d3-geo](https://github.com/d3/d3-geo)
	* `curl -L https://github.com/d3/d3-geo/releases/download/v1.4.0/d3-geo.zip -o bower_components/d3-geo.zip`
	* `unzip bower_components/d3-geo.zip -d bower_components/d3-geo`
	* `rm bower_components/d3-geo.zip`
* [topojson](https://github.com/topojson/topojson-client)
	* `curl -L https://github.com/topojson/topojson-client/releases/download/v2.1.0/topojson-client.zip -o bower_components/topojson-client.zip`
	* `unzip bower_components/topojson-client.zip -d bower_components/topojson-client`
	* `rm bower_components/topojson-client.zip`
* `cp ../data/wake-quantized-topo.json public`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)