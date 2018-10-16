chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	const videoPattern = new RegExp("www.youtube.com/watch");
	const userPattern = new RegExp("www.youtube.com/user");
	const searchPattern = new RegExp("www.youtube.com/results");
	//check the video
    if (changeInfo.status ==  "complete" && videoPattern.exec(tab.url) !== null) { //TODO: this should change on navigating without a new tab
    	console.log("calling getAndChange From OnUpdated");
        chrome.tabs.executeScript(tabId, {file: "getAndChangeBackground.js"});
    }
    //TODO: ADD in checks for user profiles and search results

})

chrome.runtime.onMessage.addListener(function(message, sender) {
	if (!message.function) {
		console.log("Unknown Message Function");
	}
	else if (message.function === "change_icon") {
		chrome.browserAction.setBadgeText({"text": "open", "tabId": sender.tab.id});
		chrome.browserAction.setBadgeBackgroundColor({"color": "#cfd1b1", "tabId": sender.tab.id});
		chrome.browserAction.setIcon({"path":message.icon, "tabId": sender.tab.id});
	}
	else if (message.function === "reset_icon") {
		chrome.browserAction.setBadgeText({"text": "", "tabId": sender.tab.id});
		chrome.browserAction.setBadgeBackgroundColor({"color": "#FFFFFF", "tabId": sender.tab.id});
		chrome.browserAction.setIcon({"path":message.icon, "tabId": sender.tab.id});
	}
	else if (message.function === "log") {
		console.log(message.message);
	}
	else if (message.function === "open_popup") {
		const notification_options = {
		    "type": 'basic',
		    "iconUrl": "logos/logo.png",
		    "title": 'AdIntuition',
		    "message": 'This is sponsored content. Click on this icon to learn more',
 		};
		chrome.notifications.create('reminder', notification_options, function(notificationId) {});
	}
});
