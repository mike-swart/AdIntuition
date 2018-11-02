chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	// console.log("tabId");
	// console.log(tabId);
	// console.log("changeInfo");
	// console.log(changeInfo);
	// console.log("tab");
	// console.log(tab);
	// console.log("\n\n\n");
	const videoPattern = new RegExp("www.youtube.com/watch");
	const userPattern = new RegExp("www.youtube.com/user");
	const searchPattern = new RegExp("www.youtube.com/results");
	//check the video
    if (changeInfo.status ===  "complete"/* changeInfo.title */&& videoPattern.exec(tab.url) !== null) { //TODO: this should change on navigating without a new tab
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
	else if (message.function === "url_check") {
		redirect(message.url);
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

function redirect(url) {
	console.log(url);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(e) {
		if (xhr.status == 200 && xhr.readyState == 4) {
			if (url != xhr.responseURL) {
				console.log(url + "   ---->   " + xhr.responseURL);
				redirect(xhr.responseURL);
			}
		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}
