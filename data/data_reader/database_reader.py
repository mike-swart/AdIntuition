import sqlite3
import csv
import re
from nltk.tokenize import word_tokenize
from nltk.text import Text

def main():
	global conn
	conn = sqlite3.connect('../youtube.db')
	c = conn.cursor()

	matches = []
	split_regex = re.compile("(\r\n)|(\n)|(\.)")
	search_regex = re.compile("(code)|(coupon)|(promotion)")
	for elem in c.execute("SELECT title, description, channelId FROM video"):
		description = elem[1]
		tokens = re.split(split_regex, description)
		textList = Text(tokens)
		for token in tokens:
			if token != None and re.search(search_regex, token) != None:
				matches.append([elem[0].encode('utf8'), token.encode('utf8'), elem[2].encode('utf8')])
	print len(matches)
	with open('matches.tsv', 'wb') as csvfile:
		writer = csv.writer(csvfile, delimiter='\t', quoting=csv.QUOTE_MINIMAL)
		writer.writerow(['title', 'desc', 'channelId'])
		for elem in matches:
	 		writer.writerow(elem)
	conn.close()
	
main()

#2100 -- check how many have an affiliate as well
#do the percentages