/* global d3 */

export function parseCurrency(currency) { 
	return Number(currency.replace(/[^0-9\.]+/g,'')); 
};

export function parseTime(time) {
	return d3.timeParse('%A, %b %e, %Y at %I:%M %p');
};

export default {
	parseCurrency: parseCurrency,
	parseTime: parseTime
};