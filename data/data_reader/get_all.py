import sqlite3
import csv
import re
from nltk.tokenize import word_tokenize
from nltk.text import Text


def get_nicknames():
	nicknames = {}
	with open("../names.csv", 'rb') as csvfile:
		reader = csv.reader(csvfile, delimiter=',')
		for row_list in reader:
			for i in range(len(row_list)):
				nicknames[row_list[i]] = []
				for j in range(len(row_list)):
					if j != i:
						nicknames[row_list[i]].append(row_list[j])
	return nicknames

nicknames_dict = get_nicknames()

def main():
	num_matches = 0
	matches = {} #indexed by username
	with open("matches.tsv", 'rb') as csvfile:
		reader = csv.reader(csvfile, delimiter='\t')
		count = 0
		keyword_regex = re.compile("( code )|( coupon )|( promotion )| ( promo )")
		#keyword_regex = re.compile("(promo code)")
		tokenize_regex = re.compile("(\r\n)|(\n)|(\.)|(\!)|(\?)")
		for row_list in reader:
			count += 1
			if count == 1:
				continue
			possible_code_bases = get_codes_from_username(row_list[1])
			if len(possible_code_bases) == 0 or (len(possible_code_bases) == 1 and possible_code_bases[0] == ""):
				#print row_list[1]
				continue
			search_regex = get_search_regex(possible_code_bases)
			coupon_regex = re.compile(search_regex)
			tokens = re.split(tokenize_regex, row_list[3])
			#textList = Text(tokens)
			for token in tokens:
				if token != None and re.search(coupon_regex, token) != None and re.search(keyword_regex, token) != None:
					num_matches += 1
					username = row_list[1]
					if username not in matches:
						matches[username] = []
					matches[username].append([possible_code_bases, token, row_list[3]])
					# print possible_code_bases
					# print token
	with open('tot.tsv', 'wb') as csvfile:
		writer = csv.writer(csvfile, delimiter='\t', quoting=csv.QUOTE_MINIMAL)
		#writer.writerow(['Video Title', 'Channel Name', 'Description Match Hit', 'Full Description'])
		for username in matches.keys():
			for elem in matches[username]:
	 			writer.writerow([username, elem[0], elem[1], elem[2]])

	print num_matches

def get_search_regex(possible_code_bases):
	if possible_code_bases == None:
		return "(" + username + ").*[0-9]*"
	search_str = "("
	for base in possible_code_bases:
		search_str += base + "|"
	search_str = search_str[0:-1] + ").*[0-9]*"
	return search_str
	

#get all possible iterations of the username
def get_codes_from_username(username):
	usernames = []
	usernames.append(re.escape(username))
	split_regex = re.compile(" ")
	tokens = re.split(split_regex, username)
	if len(tokens) > 1:
		count = 0
		initials = ""
		total_string = ""
		for token in tokens:
			usernames.append(re.escape(token))
			total_string += token
			if count != 0:
				usernames.append(re.escape(total_string))
			count += 1
			initials += token[0]
		usernames.append(re.escape(initials))
	
	last_index_used = 0
	for i in range(len(username)-1):
		c = ""
		nc = ""
		try:
			c = unicode(username[i], 'utf-8')
			nc = unicode(username[i+1], 'utf-8')
		except:
			continue
		if c.islower() and (nc.isupper() or nc.isnumeric()):
			usernames.append(re.escape(username[last_index_used: i+1]))
			usernames.append(re.escape(username[i+1:]))
			last_index_used = i+1
		elif c.isupper() and nc.isnumeric():
			usernames.append(re.escape(username[last_index_used: i+1]))
			usernames.append(re.escape(username[i+1:]))
			last_index_used = i+1
		elif c.isnumeric() and  not nc.isnumeric():
			usernames.append(re.escape(username[last_index_used: i+1]))
			usernames.append(re.escape(username[i+1:]))
			last_index_used = i+1
	return usernames

#need to check if it is a nickname
def check_token(token):
	print token


main()

def test_get_all_codes_from_username():
	get_codes_from_username("KPOP GEEK")
	get_codes_from_username("la perle beaute")
	get_codes_from_username("H20Polo")

#test_get_all_codes_from_username()

#2100 -- check how many have an affiliate as well
#do the percentages