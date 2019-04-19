function urlMatches(url, regexStr) {
	var searchPattern = new RegExp(regexStr);
	return searchPattern.test(url);
}

function urlUtmMatches(url, regexStr) {
	var searchPattern = new RegExp(regexStr);
	return searchPattern.test(url);
}

function checkRedirectsAndMatches(url, affRegex, utmRegex) {
	var isKnownLink = urlMatches(url, affRegex);
	if (isKnownLink) {return 'true';}
	var isUTMlink = urlUtmMatches(url, utmRegex);
	if (isUTMlink) {return 'utm';}
	return 'false';
}