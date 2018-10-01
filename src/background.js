alert("Updated");
chrome.browserAction.onClicked.addListener(function(tab) {
	var re = /www.youtube.com/i;
	if (tab.url.search(re) > -1) {
		alert("on youtube");
		chrome.tabs.executeScript({
          // code: 'document.body.style.backgroundColor="orange"'
          code: 'document.body.style.backgroundColor="orange"'
        });
	}
});

function getPageDetails(callback) {
    // Inject the content script into the current page
    chrome.tabs.executeScript(null, { file: 'content.js' });
    // When a message is received from the content script
    chrome.runtime.onMessage.addListener(function(message) {
        // Call the callback function
        callback(message);
    });
};
// chrome.runtime.onInstalled.addListener(function() {
// 	// chrome.contextMenus.create({
// 	// 	"id": "sampleContextMenu",
// 	// 	"title": "Sample Context Menu",
// 	// 	"contexts": ["selection"]
// 	// });
// });
// chrome.tabs.onUpdated.addListener(function() {
// 	if (tab.url.indexOf('http://youtube.com') == 0) {
// 		chrome.pageAction.show(tabId);
// 	}
// })
// chrome.webNavigation.onCompleted.addListener(function() {
//   alert("On youtube");
//   chrome.tabs.executeScript({code: 'document.body.style.backgroundColor="orange"'});
// }, {url: [{urlMatches : 'https://www.youtube.com/'}]});
