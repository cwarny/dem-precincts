import json
from re import sub

with open('data/precincts_data.ndjson') as infile, open('data/precincts_data_formatted.ndjson', 'w') as outfile:
	for line in infile:
		jsn = json.loads(line)

		a,b = jsn['code'].split('-')

		if jsn['Status'] == 'UNORGANIZED':
			d = {
				'county': jsn['County'],
				'district': jsn['District'],
				'pollingPlace': jsn['Polling location name'],
				'status': jsn['Status'],
				'code': jsn['code'],
				'ocdType': 'precinct',
				'ocdId': 'ocd-division/country:us/state:nc/county:wake/precinct:%i-%s' % (int(a), b)
			}
		else:
			d = {
				'chair': jsn['Chair'],
				'county': jsn['County'],
				'numberOfDelegates': jsn['Delegates'],
				'district': jsn['District'],
				'pollingPlace': jsn['Polling location name'],
				'secretary': jsn['Secretary'],
				'status': jsn['Status'],
				'fundGoal': jsn['Sustaining fund goal'],
				'viceChair': jsn['Vice chair'],
				'code': jsn['code'],
				'ocdType': 'precinct',
				'ocdId': 'ocd-division/country:us/state:nc/county:wake/precinct:%i-%s' % (int(a), b)
			}

			d = {
				k:v
				for k,v in d.items()
				if v != 'TBD'
			}

			if 'numberOfDelegates' in d:
				d['numberOfDelegates'] = int(d['numberOfDelegates'])

			if 'fundGoal' in d:
				d['fundGoal'] = float(sub(r'[^\d.]', '', d['fundGoal']))

		if 'events' in jsn and jsn['events']:
			d['events'] = [
				{
					'location': {
						'name': e['Location'].split('\n')[0],
						'address': e['Location'].split('\n')[2]
					},
					'title': e['Event'],
					'date': e['Date']
				}
				for e in jsn['events']
			]

		outfile.write(json.dumps(d) + '\n')