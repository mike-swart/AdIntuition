function checkRedirects(url) {
	// var wind = window.open(chrome.runtime.getURL('options.html'), "adintuition")// 'location=true,height=500,width=500,scrollbars=yes,status=yes');
	// console.log(wind.location.href);
	// wind.locationbar.visible = true;
	// wind.onhashchange = function() { 
	// 	console.log(window.location.href);
	// }
	// setTimeout(() => {wind.close();}, 5000);

	// console.log("checking: " + url);
	// var req = new Request(url, {"redirect": "manual"});
	// fetch(req).then(function(response) {
	// 	console.log(response);
	// 	if (response.type === "opaqueredirect") {
	// 		console.log(url + "  ->  " + response.url);
	// 		//checkRedirects(response.url);
	// 	}
	// 	return false;
	// })
}

//listen to messages
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (!message.function) {
		console.log("Unknown Message Function");
	}
	else if (message.function === "getMutationSummary") {
		chrome.tabs.executeScript(sender.tab.id, {file: 'mutation-summary/src/mutation-summary.js'});
	}
	else if (message.function === "checkRedirects") {
		checkRedirects(message.url);
	}
	else if (message.function === "getCouponFinder") {
		chrome.tabs.executeScript(sender.tab.id, {file: 'couponFinder.js'});
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
