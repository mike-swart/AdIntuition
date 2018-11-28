with open("strings.txt") as f:
	lines = f.readlines()
	terms = []
	for line in lines:
		if line[0:2] == "||":
			temp = line[2:-1]
			output_str = ""
			for i in range(len(temp)):
				if temp[i] == "*":
					output_str += ".*"
				elif temp[i] == "?":
					output_str += "\\\\?"
				else:
					output_str += temp[i]
			terms.append("(" + output_str + ")|")
	string = ""
	for term in terms:
		string += term
	print string[0:-1]


