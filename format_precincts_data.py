import json
from re import sub

with open('data/precincts_data.ndjson') as infile, open('data/precincts_data_formatted.ndjson', 'w') as outfile:
	for line in infile:
		jsn = json.loads(line)

		a,b = jsn['code'].split('-')

		if jsn['Status'] == 'UNORGANIZED':
			d = {
				'county-name': jsn['County'],
				'district': jsn['District'],
				'polling-place': jsn['Polling location name'],
				'organization-status': jsn['Status'],
				'code': jsn['code'],
				'ocd-type': 'precinct',
				'ocd-id': 'ocd-division/country:us/state:nc/county:wake/precinct:%i-%s' % (int(a), b)
			}
		else:
			d = {
				'chair': jsn['Chair'],
				'county-name': jsn['County'],
				'number-of-delegates': jsn['Delegates'],
				'district': jsn['District'],
				'polling-place': jsn['Polling location name'],
				'secretary': jsn['Secretary'],
				'organization-status': jsn['Status'],
				'fund-goal': jsn['Sustaining fund goal'],
				'vice-chair': jsn['Vice chair'],
				'code': jsn['code'],
				'ocd-type': 'precinct',
				'ocd-id': 'ocd-division/country:us/state:nc/county:wake/precinct:%i-%s' % (int(a), b)
			}

			d = {
				k:v
				for k,v in d.items()
				if v != 'TBD'
			}

			if 'number-of-delegates' in d:
				d['number-of-delegates'] = int(d['number-of-delegates'])

			if 'fund-goal' in d:
				d['fund-goal'] = float(sub(r'[^\d.]', '', d['fund-goal']))

		if 'events' in jsn and jsn['events']:
			d['events'] = [
				{
					'location': {
						'name': e['Location'].split('\n')[0],
						'address': e['Location'].split('\n')[2]
					},
					'title': e['Event'],
					'date': sub(r' at ', ', ', e['Date'])
				}
				for e in jsn['events']
			]

		outfile.write(json.dumps(d) + '\n')