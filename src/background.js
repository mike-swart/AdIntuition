var reqIdToUrl = {};
var urlToResponse = {};

function sendBackValue(reqId) {
	var url = reqIdToUrl[reqId];
	var response = urlToResponse[url];
	delete reqIdToUrl[reqId];
	delete urlToResponse[url];
	console.log(url + "\t" + response);
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
		//console.log(url + "\t " + SERVER_ADDRESS + resp.urlQueryString);
		xhr.onload = function() {
			//console.log(xhr);
			// if (xhr.response === 'true') {
			// 	//A match was found!!!
			// 	addBanner("normal", HIGHLIGHT_COLOR);
			// 	document.getElementById("AdIntuitionDescription").getElementsByTagName('a')[index].style.backgroundColor = HIGHLIGHT_COLOR;
			// }
			// else if (xhr.response !== "false") { //for some reason, using '=== "utm"' here does not work
			// 	//A match was found!!!
			// 	addBanner("coupon", COUPON_HIGHLIGHT_COLOR);
			// 	document.getElementById("AdIntuitionDescription").getElementsByTagName('a')[index].style.backgroundColor = UTM_HIGHLIGHT_COLOR;
			// }
		}
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
