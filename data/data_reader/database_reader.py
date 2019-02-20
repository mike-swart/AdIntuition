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
	q = c.execute("SELECT video.title, video.description, channel.title FROM video Left Join channel on video.channelId = channel.id")
	for elem in q:
		description = elem[1]
		tokens = re.split(split_regex, description)
		textList = Text(tokens)
		for token in tokens:
			if token != None and re.search(search_regex, token) != None:
				videoTitle = elem[0].encode('utf8')
				channelName = ""
				if elem[2]:
					channelName = elem[2].encode('utf8')
				matches.append([videoTitle, channelName, token.encode('utf8'), elem[1].encode('utf8')])
	print len(matches)
	with open('matches1.tsv', 'wb') as csvfile:
		writer = csv.writer(csvfile, delimiter='\t', quoting=csv.QUOTE_MINIMAL)
		writer.writerow(['Video Title', 'Channel Name', 'Description Match Hit', 'Full Description'])
		for elem in matches:
	 		writer.writerow(elem)
	conn.close()
	
main()

#2100 -- check how many have an affiliate as well
#do the percentages