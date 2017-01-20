import requests
from bs4 import BeautifulSoup

def get_sibling(element):
	return element.next_sibling if element.next_sibling != '\n' else get_sibling(element.next_sibling)

root_url = 'https://enr.ncsbe.gov/voter_search_public/voter_details.aspx'

seed = 31284276

i = 0
while i <= seed:
	r = requests.get(root_url, params={'voter_reg_num': '{0:012d}'.format(seed+i), 'county': 92})
	r = requests.get(root_url, params={'voter_reg_num': '{0:012d}'.format(seed-i), 'county': 92})
	soup = BeautifulSoup(r.content, 'html.parser')
	i += 1

def get_data(n):
	r = requests.get(root_url, params={'voter_reg_num': '{0:012d}'.format(n), 'county': 92})
	if 'error' in r.content:
		raise

	soup = BeautifulSoup(r.content, 'html.parser')

	d = {}

	voterdetails = soup.find(id='voterdetails')

	if 

	{
		'name': voterdetails.find(id='lblVoterName').text,
		'address': ', '.join([c for c in voterdetails.find(id='lblVoterAddress').contents if not isinstance(c,bs4.element.Tag)])
	}
	
	{
		tr.find_all('td')[0].text.strip()[:-1]: tr.find_all('td')[1].text.strip()
		for tr in voterdetails.find(id='gvVoterDetails').find_all('tr')
		if tr.find_all('td')[0].text.strip()
	}

	{
		'polling_place': {
			'name': soup.find(id='hlPollingPlaceName'),
			'address': '.join([c for c in voterdetails.find(id='lblPollingPlaceAddr').contents if not isinstance(c,bs4.element.Tag)])
		}
	}

	jurisdictions = soup.find(id='jurisdictions')

	{
		tr.find_all('td')[0].text.strip()[:-1]: tr.find_all('td')[1].text.strip()
		for tr in jurisdictions.find(id='gvJurisdictions').find_all('tr')
	}

	voterhistory = soup.find(id='voterhistory')

	headers = [th.text for th in voterhistory.find(id='gvVoterHistory').find_all('th')]
	{
		'voting_history': [
			{
				header: td.text.strip()
				for header,td in zip(headers, tr.find_all('td'))
				if td.text.strip()
			}
			for tr in voterhistory.find(id='gvVoterHistory').find_all('tr')[1:]
		]
	}

	sampleballots = soup.find(id='sampleballots')
	if sampleballots.find(id='sampleballotslist').text.strip():
		raise

	absentee = soup.find(id='absentee')
	if absentee.find(id='absenteelist').text.strip():
		raise