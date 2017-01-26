import csv
import json

with open('data/ncvoter92.txt', encoding='ISO-8859-1') as infile, open('data/ncvoter92.ndjson','w') as outfile:
	reader = csv.DictReader(infile, delimiter='\t')
	for row in reader:
		d = {
			'county': {
				'id': row['county_id'],
				'name': row['county_desc']
			},
			'regNum': row['voter_reg_num'],
			'status': {
				'name': row['voter_status_desc'],
				'reason': row['voter_status_reason_desc']
			},
			'name': {
				'first': row['first_name'],
				'last': row['last_name'],
				'middle': row['middle_name'],
				'suffix': row['name_suffix_lbl']
			},
			'address': {
				'residence': {
					'street': row['res_street_address'],
					'city': row['res_city_desc'],
					'state': row['state_cd'],
					'zip': row['zip_code']
				},
				'mail': {
					'addr1': row['mail_addr1'],
					'addr2': row['mail_addr2'],
					'addr3': row['mail_addr3'],
					'addr4': row['mail_addr4'],
					'city': row['mail_city'],
					'state': row['mail_state'],
					'zip': row['mail_zipcode']
				}
			},
			'phoneNumber': row['full_phone_number'],
			'race': row['race_code'],
			'ethnicity': row['ethnic_code'],
			'party': row['party_cd'],
			'gender': row['gender_code'],
			'age': int(row['birth_age']) if row['birth_age'] else '',
			'birthState': row['birth_state'],
			'driversLic': row['drivers_lic'],
			'registrationDate': row['registr_dt'],
			'precinct': row['precinct_desc'],
			'municipality': row['municipality_desc'],
			'ward': row['ward_desc'],
			'cong': 'ocd-division/country:us/state:nc/cd:%i' % int(row['cong_dist_abbrv']) if row['cong_dist_abbrv'] else '',
			'superCourt': 'ocd-division/country:us/state:nc/cd:%s' % row['super_court_abbrv'] if row['super_court_abbrv'] else '',
			'judic': row['judic_dist_abbrv'],
			'senate': 'ocd-division/country:us/state:nc/sldu:%i' % int(row['nc_senate_abbrv']) if row['nc_senate_abbrv'] else '',
			'house': 'ocd-division/country:us/state:nc/sldl:%i' % int(row['nc_house_abbrv']) if row['nc_house_abbrv'] else '',
			'council': 'ocd-division/country:us/state:nc/county:wake/council_district:%i' % int(row['county_commiss_abbrv']) if row['county_commiss_abbrv'] else '',
			'boe': 'ocd-division/country:us/state:nc/county:wake/school_board_district:%i' % int(row['school_dist_abbrv']) if row['school_dist_abbrv'] else ''
		}

		d = { k:v for k,v in d.items() if v }

		outfile.write(json.dumps(d) + '\n')