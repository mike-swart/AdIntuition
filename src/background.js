var reqIdToUrl = {};
var urlToResponse = {};
var urlToTabId = {};

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
						if (!tab) {
							console.log("Cannot find original tab");
							return;
						}
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
		//console.log(tab + "\t" + JSON.stringify(message));
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
	//console.log(info.statusCode + "\t" + url);
	if (redirects === 'true') {
		urlToResponse[urlOriginal] = 'true';
	}
	else if (redirects === 'utm') {
		if (urlToResponse[urlOriginal] === 'false') {
			urlToResponse[urlOriginal] = 'utm';
		}
	}
}

chrome.webRequest.onHeadersReceived.addListener(
    function(info) {
    	var from = ""
    	if (info && info.initiator) {
    		 from = info.initiator;
    	}
    	var ext = "chrome-extension://" + chrome.runtime.id;
    	if (from === ext) {
      		if (info.statusCode && info.statusCode >= 300 && info.statusCode < 400) {
      			checkForRedirects(info)
      		}
      		// else if (info.requestId && info.requestId in reqIdToUrl) { //we have reached the end of the redirect chain
      		// 	checkForRedirects(info);
      		// 	sendBackValue(info.requestId);
      		// }
      		else {
      			//end of redirect chain
      			checkForRedirects(info);
      			sendBackValue(info.requestId);
      		}
      	}
    },
    {
        urls: ['*://*/*'],
    },
    ['extraHeaders']
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
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (!message.function) {
		console.log("Unknown Message Function");
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
		chrome.browserAction.setBadgeText({"text": "open", "tabId": sender.tab.id});
		chrome.browserAction.setBadgeBackgroundColor({"color": "#cfd1b1", "tabId": sender.tab.id});
		chrome.browserAction.setIcon({"path":message.icon, "tabId": sender.tab.id});
	}
	else if (message.function === "play_sound") {
		var sound = new Audio();
		sound.src = 'beat2.wav';
		sound.play();
		//uncomment this to play 2 beeps instead of 1
		//window.setTimeout(function() {sound.play();}, 500);
	}
	else if (message.function === "reset_icon") {
		chrome.browserAction.setBadgeText({"text": "", "tabId": sender.tab.id});
		chrome.browserAction.setBadgeBackgroundColor({"color": "#FFFFFF", "tabId": sender.tab.id});
		chrome.browserAction.setIcon({"path":message.icon, "tabId": sender.tab.id});
	}
	else if (message.function === "log") {
		console.log(message.message);
	}
	else if (message.function === "open_desktop_notification") {
		const notification_options = {
		    "type": 'basic',
		    "iconUrl": "logos/logo.png",
		    "title": 'AdIntuition',
		    "message": 'This page has sponsored content',
 		};
		chrome.notifications.create('reminder', notification_options, function(notificationId) {});
	}
});

//clean up the dictionaries-- this should not be necessary
chrome.tabs.onRemoved.addListener(function(tabId, info) {
	for (key in urlToTabId) {
		if (urlToTabId[key] === tabId) {
			delete urlToTabId[key];
		}
}
});

