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
	# split_regex = re.compile("(\r\n)|(\n)|(\.)")
	# search_regex = re.compile("(code)|(coupon)|(promotion)")
	for elem in c.execute("SELECT name FROM SQLITE_MASTER where TYPE='table'"):
		print elem
	for elem in c.execute("SELECT autoId, id, title FROM channel limit 1"):
		print elem
	for elem in c.execute("SELECT * FROM SQLITE_MASTER where Type='table' and table=''"):
		print elem
	
main()

#2100 -- check how many have an affiliate as well
#do the percentages