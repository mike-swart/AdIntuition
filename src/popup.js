console.log("here");
function onPageDetailsReceived(pageDetails) {
    document.getElementById('title').value = pageDetails.title;
    document.getElementById('url').value = pageDetails.url;
    document.getElementById('summary').innerText = pageDetails.summary;
}

chrome.runtime.getBackgroundPage(function(eventPage) {
	console.log(eventPage);
	eventPage.getPageDetails(onPageDetailsReceived);
});
