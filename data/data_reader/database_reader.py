import sqlite3
from nltk.tokenize import word_tokenize
from nltk.text import Text

def main():
	global conn
	conn = sqlite3.connect('../../data/youtube.db')
	c = conn.cursor()

	matches = []
	words = ['sponsor', 'sponsored', 'parnter', 'partnership']
	for elem in c.execute("SELECT title, description, channelId FROM video limit 10000"):
		description = elem[1]
		tokens = word_tokenize(description)
		textList = Text(tokens)
		for token in tokens:
			if token in words:
				matches.append(elem)
	print len(matches)
	for match in matches:
		print match[1]	
	#close the connection
	conn.close()
	
main()