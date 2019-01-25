var NUM_RETRIES = 5;
var HIGHLIGHT_COLOR = "#fccdd3";
var SERVER_ADDRESS = "https://ovqz88jgqf.execute-api.us-west-2.amazonaws.com/default/SocialMediaEndorsements?url="
var OAUTH_CLIENT = "AIzaSyDTsjsoSs-c9ygvEQvxx6iTqdgTO6M-C0M"
var totalVids = 0


//settings
var shouldShowBanner = true;
var shouldHighlightURL = true;
var shouldHighlightTitle = false;
var shouldPlaySound = false;
var shouldShowDesktopNotification = false;

run();

function run() {
	// getOptions();
	addObserver();
	// if (!document.getElementById("AdIntuitionMarker")) {
	// 	addObserver();
	// }
}

function addObserver(){
	//ytd-promoted-video-renderer.style-scope ytd-search-pyv-renderer
	try {
		var observer = new MutationSummary({
			callback: handleChanges,
			queries: [
				{ element: [".style-scope.ytd-item-section-renderer"]},
				{ element: ".style-scope.ytd-item-section-renderer"},
			]
		});
		var marker = document.createElement("div");
		marker.id = "AdIntuitionMarker";
		document.lastElementChild.appendChild(marker);
	}
	catch(err) {
		chrome.runtime.sendMessage({"function": "getMutationSummary"});
		window.setTimeout(function() {addObserver();}, 20);
	}
}

function handleChanges(summaries) {
	console.log("here");
	var videos = document.getElementsByTagName("ytd-thumbnail");
	var needToAdd = false;
	//check to see if any videos have been checked
	if (videos[0].getElementsByTagName("adintuitionchecked").length === 0) {
		totalVids += videos.length;
		for (var i=0; i<videos.length; i++) {
			checkVideo(videos[i], i);
		}
	}
	totalVids = videos.length;
	videos = summaries[0].added;
	for (var i=0; i<videos.length; i++) {
		checkVideo(videos[i], totalVids - videos.length + i);
	}
}

function checkVideo(video, index) {
	var vid = video;
	if (video.getElementsByTagName("ytd-thumbnail").length !== 0) {
		//is one of the unchecked
		vid = video.getElementsByTagName("ytd-thumbnail")[0];
	}
	if (vid.getElementsByTagName("adintuitionchecked").length !== 0) {
		return
	}
	var marker = document.createElement("adintuitionchecked");
	vid.appendChild(marker);
	var youtubeURL = vid.getElementsByTagName("a")[0].href;
	var videoID = youtubeURL.substring(youtubeURL.indexOf("v=") + 2)
	var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoID + "&key=" + OAUTH_CLIENT
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onloadend = function() {
		var desc = this.response.items[0].snippet.description;
		var urls = getUrlsFromDescriptionString(desc);
		for (var i=0; i< urls.length; i++) {
			checkRedirect(urls[i], vid);
		}
	}
	xhr.responseType = "json";
	xhr.send();
}

function checkRedirect(url, vid) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", SERVER_ADDRESS + url, true);
	xhr.onload = function() {
		if (xhr.response === 'true') {
			//console.log("here at index" + index);
			// console.log(document.getElementsByTagName("ytd-thumbnail"));
			var parentNode = vid.parentNode
			//the difference is small (means that it is close in distance and therefore just the general parent node)
			if (parentNode.compareDocumentPosition(document.getElementsByTagName("ytd-thumbnail")[0]) < 5) {
				//the description of the video in the list
				parentNode.childNodes[3].childNodes[3].style.backgroundColor = HIGHLIGHT_COLOR;
				//parentNode.childNodes[1].childNodes[0].style.backgroundColor = HIGHLIGHT_COLOR;
			}
		}
	}
	xhr.send();
}

function getUrlsFromDescriptionString(desc) {
	var urlFindingPattern = new RegExp("http[s]?:\/\/[^\/\s]*\.[^\/\s]*\.[^\/\s][^\/\s][-a-zA-Z0-9@:%_\+.~#?&//=]*");
	var urlFind = urlFindingPattern.exec(desc);
	var arr = []
	while (urlFind) {
		var url = urlClean(urlFind[0])
		arr.push(url);
		desc = desc.substring(urlFind.index + url.length);
		urlFind = urlFindingPattern.exec(desc);
	}
	return arr
}

function urlClean(givenUrl) {
	var url = givenUrl.slice(0);
	var index = url.indexOf("\n")
	while (index > -1) {
		url = url.substring(0,index);
		index = url.indexOf("\n")
	}

	var index = url.indexOf(" ")
	while (index > -1) {
		url = url.substring(0,index);
		index = url.indexOf(" ")
	}

	var index = url.indexOf("\r")
	while (index > -1) {
		url = url.substring(0,index);
		index = url.indexOf("\r")
	}

	return url
}


