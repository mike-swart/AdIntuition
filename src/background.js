var reqIdToUrl = {};
var urlToResponse = {};
var urlToTabId = {};

function sendBackValue(reqId) {
	var url = reqIdToUrl[reqId];
	var response = urlToResponse[url];
	var tab = urlToTabId[url];
	delete reqIdToUrl[reqId];
	delete urlToResponse[url];
	delete urlToTabId[url];
	if (response !== 'false') {
		var message = {'message': 'highlight', 'url': url, 'type': response};
		chrome.tabs.sendMessage(tab, message);
	}
	console.log(urlToTabId)
}

function getUrlFromReqId(reqId, url) {
	if (!(reqId in reqIdToUrl)) {
		reqIdToUrl[reqId] = url;
		urlToResponse[url] = 'false';
	}
	return reqIdToUrl[reqId];
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
      		else if (info.requestId && info.requestId in reqIdToUrl) {
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
	else if (message.function === "getEncodedUrl") {
		var url = message.url;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		if (!(url in urlToTabId)) {
			urlToTabId[url] = sender.tab.id;
		}
		xhr.onload = function() {}
		xhr.send();
	}
	else if (message.function === "checkRedirects") {
		checkRedirects(message.url);
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

//clean up the dictionaries
chrome.tabs.onRemoved.addListener(function(tabId, info) {
	for (key in urlToTabId) {
		if (urlToTabId[key] === tabId) {
			delete urlToTabId[key];
		}
		// if (url in urlToResponse) {
		// 	delete urlToResponse[url];
		// }
	}
	console.log(urlToTabId);
});
