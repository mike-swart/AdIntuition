var reqIdToUrl = {};
var urlToResponse = {};
var urlToTabId = {};

var SERVER_STRING = "https://lj71toig7l.execute-api.us-west-2.amazonaws.com/default/AdIntuitionTracker"

function getTabId(url) {
	var tab = urlToTabId[url];
	if (tab) {return tab;}
	var newUrl = url.substring(0,4) + url.substring(5);
	tab = urlToTabId[newUrl];
	return tab;
}

function sendBackValue(reqId) {
	var url = reqIdToUrl[reqId];
	var response = urlToResponse[url];

	delete reqIdToUrl[reqId];
	delete urlToResponse[url];

	//tabId might not have the same Id
	var tab = urlToTabId[url];
	if (!tab) {
		//the original might have been http:// not https://
		var newUrl = url.substring(0,4) + url.substring(5);
		tab = urlToTabId[newUrl];
		if (!tab) {
			//check for changing of cases-- need to check all keys but list is relatively small
			for (key in urlToTabId) {
				if (key.toLowerCase() === url.toLowerCase()) {
					tab = urlToTabId[key];
					newUrl = key;
					if (!tab) {
						newUrl = url.substring(0,4) + url.substring(5);
						tab = urlToTabId[newUrl];
						url = newUrl;
					}
					else {
						//the key was found-- change the url to check for in the description
						url = newUrl;
					}
				}
			}
		}
		else {
			//the https: -> http: fix worked-- change the url to check for in the description
			url = newUrl;
		}
	}

	delete urlToTabId[url];
	if (response !== 'false') {
		var message = {'message': 'highlight', 'url': url, 'type': response};
		if (!tab) {
			console.log("Cannot find original tab"); //this can happen if a link is repeated in a description
			return;
		}
		chrome.tabs.sendMessage(tab, message);
	}
}

function getUrlFromReqId(reqId, url) {
	if (!(reqId in reqIdToUrl)) {
		reqIdToUrl[reqId] = url;
		urlToResponse[url] = 'false';
	}
	return reqIdToUrl[reqId];
}

function checkForRedirects(info) {
	var url = info.url
	var reqId = info.requestId
	var redirects = checkRedirectsAndMatches(url);
	var urlOriginal = getUrlFromReqId(reqId, url);
	if (redirects === 'true') {
		urlToResponse[urlOriginal] = 'true';
	}
	else if (redirects === 'utm') {
		if (urlToResponse[urlOriginal] === 'false') {
			urlToResponse[urlOriginal] = 'utm';
		}
	}
}

browser.webRequest.onHeadersReceived.addListener(
    function(info) {
    	var from = "";
    	if (info && info.originUrl) {
    		 from = info.originUrl;
    	}
    	var ext = "moz-extension://.*/adintuitionbackground.html";
    	var searchPattern = new RegExp(ext);
    	var matches = searchPattern.test(from);
    	console.log(matches);
     	if (matches) {
    		//Make sure that it was not a call to the server for logging purposes
    		if (info.url.substring(0,SERVER_STRING.length) === SERVER_STRING) { 
    			return;
    		}
    		// var responseHeaders = info.responseHeaders;
    		// for (var i=0; i<responseHeaders.length; i++) {
    		// 	var hdr = responseHeaders[i];
    		// 	if (hdr.name === "Refresh") {
    		// 		var searchTerm = "URL=";
    		// 		var newUrl = hdr.value.substring(hdr.value.indexOf(searchTerm) + searchTerm.length);
    		// 		console.log(newUrl);
    		// 		console.log(newUrl.length);
    		// 	}
    		// }
      		if (info.statusCode && info.statusCode >= 300 && info.statusCode < 400) {
      			checkForRedirects(info)
      		}
      		else {
      			//end of redirect chain
      			checkForRedirects(info);
      			sendBackValue(info.requestId);
      		}
      	}
    },
    {
        urls: ['http://*/*', "https://*/*"],
    },
    ["responseHeaders"]
);

function getRandomString() {
	const possibleVals = "1234567890ABCDEF";
	var totString = ""
	for(var i = 0; i < 32; i++) {
		totString += possibleVals.charAt(Math.floor(Math.random() * possibleVals.length));
	}
	return totString
}

//listen to messages
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (!message.function) {
		console.log("Unknown Message Function");
	}
	else if (message.function === 'logToServer') {
		var xhr = new XMLHttpRequest();
		var qUrl = message.qUrl;
		xhr.open("GET", qUrl, true);
		xhr.onload = function() {
			var shouldContinue = JSON.parse(this.responseText)['shouldLog'];
			shouldContinue = true;
			if (!shouldContinue) {
				browser.storage.sync.set({shouldLog: false});
			}
		}
		xhr.send();
	}
	else if (message.function === "checkRedirect") {
		var url = message.url;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		if (!(url in urlToTabId)) {
			urlToTabId[url] = sender.tab.id;
		}
		//xhr.onload = function() {}
		xhr.send();
	}
	else if (message.function === "change_icon") {
		browser.browserAction.setBadgeText({"text": "open", "tabId": sender.tab.id});
		browser.browserAction.setBadgeBackgroundColor({"color": "#cfd1b1", "tabId": sender.tab.id});
		browser.browserAction.setIcon({"path":message.icon, "tabId": sender.tab.id});
	}
	else if (message.function === "play_sound") {
		var sound = new Audio();
		sound.src = 'beat2.wav';
		sound.play();
		//uncomment this to play 2 beeps instead of 1
		//window.setTimeout(function() {sound.play();}, 500);
	}
	else if (message.function === "reset_icon") {
		browser.browserAction.setBadgeText({"text": "", "tabId": sender.tab.id});
		browser.browserAction.setBadgeBackgroundColor({"color": "#FFFFFF", "tabId": sender.tab.id});
		browser.browserAction.setIcon({"path":message.icon, "tabId": sender.tab.id});
	}
	else if (message.function === "log") {
		console.log(message.message);
	}
});

//clean up the dictionaries-- this should not be necessary
browser.tabs.onRemoved.addListener(function(tabId, info) {
	for (key in urlToTabId) {
		if (urlToTabId[key] === tabId) {
			delete urlToTabId[key];
		}
}
});

