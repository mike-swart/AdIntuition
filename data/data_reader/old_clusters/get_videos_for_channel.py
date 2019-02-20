import sqlite3
import csv
import re
from nltk.tokenize import word_tokenize
from nltk.text import Text

def main():
	global conn
	conn = sqlite3.connect('../../youtube.db')
	c = conn.cursor()

	channels = {}
	count = 0
	for elem in c.execute('''SELECT v.autoId as autoId, 
                                    v.id as id,
                                    v.channelId as channelId,
                                    v.title as title,
                                    v.description as description,
                                    c.title as channelTitle,
                                    c.subscriberCount as channelSubscriberCount
                                    from video v 
                                    left join channel c on v.channelId = c.id
                                    order by c.subscriberCount desc
                                    limit 100'''):
		vid_id = elem[1]
		chan_title = elem[5]
		subs = elem[6]
		if chan_title not in channels:
			channels[chan_title] = [subs]
			print chan_title
		channels[chan_title].append(vid_id)
		count += 1
	print "_________________________________________"
	with open('videos.tsv', 'wb') as csvfile:
		writer = csv.writer(csvfile, delimiter='\t', quoting=csv.QUOTE_MINIMAL)
		for key in channels.iterkeys():
			try:
				vals = [key]
				for vid in channels[key]:
					vals.append(str(vid))
		 		writer.writerow(vals)
	 		except:
	 			print "Error with: " + str(key)
	conn.close()


	
main()

#2100 -- check how many have an affiliate as well
#do the percentages