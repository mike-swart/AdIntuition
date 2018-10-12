chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
    	console.log("calling getAndChange From OnUpdated");
        chrome.tabs.executeScript(tabId, {file: "getAndChangeBackground.js"});
    }
})

chrome.runtime.onMessage.addListener(function (message) {
	console.log(message);
	alert(message);
	window.open("popup.html", "extension_popup", "width=300,height=400,status=no,scrollbars=yes,resizable=no");
});
