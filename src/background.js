chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	const videoPattern = new RegExp("www.youtube.com/watch");
	const userPattern = new RegExp("www.youtube.com/user");
	const searchPattern = new RegExp("www.youtube.com/results");
    if (changeInfo.status ===  "loading") {
    	if (videoPattern.exec(tab.url) !== null) { //TODO: this should change on navigating without a new tab
    		chrome.tabs.insertCSS(tabId, {file: "common.css"});
			chrome.tabs.executeScript(tabId, {file: 'mutation-summary/src/mutation-summary.js'});
			chrome.tabs.executeScript(tabId, {file: "getAndChangeBackground.js"});
    }
    //TODO: ADD in checks for user profiles and search results
})

// chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
//	return
// })

//listen to messages
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (!message.function) {
		console.log("Unknown Message Function");
	}
	else if (message.function === "getMutationSummary") {
		chrome.tabs.executeScript(sender.tab.id, {file: 'mutation-summary/src/mutation-summary.js'});
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
		window.setTimeout(function() {sound.play();}, 500);
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
