import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

voters = pd.read_csv('data/ncvoter92.txt', sep='\t', parse_dates=['registr_dt'], date_parser=lambda d: pd.datetime.strptime(d, '%m/%d/%Y'), encoding='ISO-8859-1', dtype=str)
voters['birth_age'] = pd.to_numeric(voters['birth_age'])

# Age distribution

sns.countplot(x='age', data=voters)

# Sort precincts by number of registered voters

sns.countplot(x='precinct_abbrv', color='blue', order=voters.groupby('precinct_abbrv').size().sort_values(ascending=False).index, data=voters)

# See with how many NC House districts each precinct intersects with

voters.groupby(['precinct_abbrv','nc_house_abbrv']).size().reset_index().groupby('precinct_abbrv').size().sort_values(ascending=False).head()

