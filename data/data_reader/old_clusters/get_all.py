import sqlite3
import csv
import re

def main():
	num_matches = 0
	#the clusters 
	disclosures = [372,382,383,384,385,388,389,390]
	expl_disclosure = [370,377,378,379,380,381,386,387]
	support_channel = [363,364,366,367,368,369]

	channels = {}
	videos = {}
	with open("videos.tsv", 'rb') as csvfile:
		count  = 0
		reader = csv.reader(csvfile, delimiter='\t')
		for row_list in reader:
			chan_title = row_list[0]
			subs = row_list[1]
			vids = row_list[2:]
			channels[chan_title] = {"subs": subs, "vids": vids, "num_affiliates": 0, "num_disclosures": 0, "num_explanations": 0, "num_support_channels": 0}
			for vid in vids:
				videos[vid] = chan_title
	seen = {}
	with open("clusters.csv", 'rb') as csvfile:
		count = 0
		reader = csv.reader(csvfile, delimiter=',')
		for row_list in reader:
			count += 1
			if count == 1:
				continue
			id_ = row_list[0]
			sentence = row_list[1]
			cluster = int(row_list[2])

			if id_ in videos:
				if id_ not in seen:
					seen[id_] = True
					channels[videos[id_]]["num_affiliates"] += 1
				if cluster in disclosures:
					channels[videos[id_]].num_disclosures += 1
				if cluster in expl_disclosure:
					channels[videos[id_]].num_explanations += 1
				if cluster in support_channel:
					channels[videos[id_]].num_support_channels += 1
	with open('out.tsv', 'wb') as csvfile:
		writer = csv.writer(csvfile, delimiter='\t', quoting=csv.QUOTE_MINIMAL)
		writer.writerow(["Channel Name", "Subscribers", "# of vids in dataset", "# affiliate vids", "# disclosures", "# num_explanations", "# support channels"])
		for key in channels.iterkeys():
			writer.writerow([key, channels[key]["subs"], len(channels[key]["vids"]), channels[key]["num_affiliates"], channels[key]["num_disclosures"], channels[key]["num_explanations"], channels[key]["num_support_channels"]])

main()
			