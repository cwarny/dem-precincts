from bs4 import BeautifulSoup
import requests
from urllib.parse import urlparse
import json

def get_sibling(element):
	return element.next_sibling if element.next_sibling != '\n' else get_sibling(element.next_sibling)

root_url = 'http://precincts.wakedems.org/counties/WAKE'
host = urlparse(root_url).hostname
r = requests.get(root_url)

soup = BeautifulSoup(r.content, 'html.parser')

with open('data/data.json','w',newline='') as jsonout:
	for link in soup('a'):
		if 'precincts' in link['href']:
			precinct_url = 'http://%s%s' % (host, link['href'])
			res = requests.get(precinct_url)
			s = BeautifulSoup(res.content, 'html.parser')
			code = s.find('h1').text.strip().split(' ')[1]
			d = {
				dt.text[:-1]: get_sibling(dt).text.strip()
				for dl in s('dl')[:2]
				for dt in dl('dt')
			}
			d['code'] = code
			d['events'] = [
				{ 
					dt.text: get_sibling(dt).text.strip()
					for dt in dl('dt')
				}
				for dl in s('dl')[2:]
			]
			jsonout.write(json.dumps(d) + '\n')