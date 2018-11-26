var NUM_RETRIES = 5;
var HIGHLIGHT_COLOR = "#fccdd3";

//text constants
var BANNER_NORMAL = "AdIntuition detected a sponsorship in this video";
var BUTTON_NORMAL = "Exit";
var BANNER_OPTIONS = {
	"normal": {
		"text": BANNER_NORMAL,
		"button": BUTTON_NORMAL,
	},
}

//settings
var shouldShowBanner = true;
var shouldHighlightURL = true;
var shouldHighlightTitle = false;
var shouldPlaySound = false;
var shouldShowDesktopNotification = false;

run();

function run() {
	getOptions();
	console.log(document.getElementById("AdIntuitionMarker"));
	if (!document.getElementById("AdIntuitionMarker")) {
		console.log("adding observer");
		addObserver();
	}
}

function getOptions() {
	chrome.storage.sync.get({
		banner: true,
		textHighlighted: true,
		titleHighlighted: false,
		sound: false,
		desktopNotification: false,
	}, function(items) {
		shouldShowBanner = items.banner;
		shouldHighlightURL = items.textHighlighted;
		shouldHighlightTitle = items.titleHighlighted;
		shouldPlaySound = items.sound;
		shouldShowDesktopNotification = items.desktopNotification;
	});
}

function printInDumbObserver() {
	console.log("In dumb observer");
}

function addObserver(){
	try {
		var observer = new MutationSummary({
			callback: handleChanges,
			queries: [
				{ element: ["yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer"]},
				{ element: "yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer"},
			] //TODO: if no description is present, then these do not work-- need to figure out #description
		});
		var marker = document.createElement("div");
		marker.id = "AdIntuitionMarker";
		document.lastElementChild.appendChild(marker);
	}
	catch(err) {
		console.log(err);
		console.log("catching");
		chrome.runtime.sendMessage({"function": "getMutationSummary"});
		window.setTimeout(function() {addObserver();}, 5);
	}
}

function handleChanges(summaries) {
	//getOptions();
	removeBanner();
	var desc = document.getElementById("description").getElementsByTagName('a');
	var haveSeenMatch = false;
	for (var i=0; i<desc.length; i++) {
		checkSponsored(i);
	}
}

function remake() {
	removeBanner();
	chrome.runtime.sendMessage({"function": "reset_icon", "icon":"logos/logo.png"});
	elems = document.getElementById("description").getElementsByTagName('a');
	for (var i=0; i<elems.length; i++) {
		elem.style.backgroundColor = "#FFFFFF";
	}
}

function playSound() {
	if (shouldPlaySound) {
		chrome.runtime.sendMessage({"function": "play_sound"});
	}
}

function showDesktopNotification() {
	if (shouldShowDesktopNotification) {
		chrome.runtime.sendMessage({"function": "open_desktop_notification"});
	}
}

function addBanner(bannerType) {
	//in case banner is not selected in settings, add another invisible tag
	if (document.getElementById("AdIntuition") !== null) {
		return;
	}
	const bannerConstants = BANNER_OPTIONS[bannerType];
	var banner = document.createElement("div");
	banner.innerHTML = "<div id='AdIntuition' style='background-color:" + HIGHLIGHT_COLOR + "; text-align:right; padding-right:10px; padding-bottom:1px; padding-top:1px;'>"+ bannerConstants.text + "&nbsp&nbsp</div>";
	element = document.getElementById("masthead");
	element.parentNode.insertBefore(banner, element.nextSibling);
	var bannerButton = document.createElement("a");
	bannerButton.classList.add("bannerbutton");
	bannerButton.innerHTML = bannerConstants.button
	bannerButton.onclick = (function() {removeBanner();})
	document.getElementById("AdIntuition").appendChild(bannerButton);

	//NOTE: Any currently open tabs will need to be refreshed
	if (!shouldShowBanner) { //use settings
		document.getElementById("AdIntuition").style.display = "none";
	}
	else {
		document.getElementById("AdIntuition").style.display = "block";
	}
	playSound();
	showDesktopNotification();
	highlightTitle();
}

function rotateIcon(stateNum) {
	if (stateNum === 41) {
		return
	}
	const icons = ["logos/logo.png", "logos/logo1.png", "logos/logo2.png", "logos/logo3.png"];
	window.setTimeout(function() {
		chrome.runtime.sendMessage({"function": "change_icon", "icon": icons[stateNum%4]});
		rotateIcon(stateNum+1);
	}, 500);
}

function checkSponsored(index) {
	document.getElementById("description").getElementsByTagName('a')[index].style.backgroundColor = "#FFFFFF";
	var url = document.getElementById("description").getElementsByTagName('a')[index].innerHTML;
	checkRedirect(url, index);
}

function checkRedirect(url, index) {
	if (url.substring(0,5) === "http:") {
		url = "https" + url.substring(4);
	}
	if (url.substring(0,6) !== "https:") {
		return false
	}
	console.log(url);
	//TODO: should probably check the url using regex or add a try/catch
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(e) {
		//look for 300, which is redirect
		if (xhr.status == 300) {
			console.log("300");
			console.log(xhr);
		}
		if (xhr.status == 200 && xhr.readyState == 4) {
			if (url != xhr.responseURL) {
				addBanner("normal");
				console.log(url + " --> " + xhr.responseURL);
				var headers = xhr.getAllResponseHeaders();
				//console.log(headers);
				document.getElementById("description").getElementsByTagName('a')[index].style.backgroundColor = HIGHLIGHT_COLOR;
				/*document.getElementById("description").getElementsByTagName('a')[index].onmouseover = (function() {
					document.getElementById("AdIntuition").style.backgroundColor = getRandomColor();
				});
				document.getElementById("description").getElementsByTagName('a')[index].onmouseout = (function(){
					document.getElementById("AdIntuition").style.backgroundColor = HIGHLIGHT_COLOR;
				});*/
				checkRedirect(xhr.responseURL, index);
			}
		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}

function removeBanner() {
	var element = document.getElementById("AdIntuition");
	if (element) {
    	element.parentNode.removeChild(element);
    }
}

function highlightTitle() {
	//element to highlight. This is the Title Box
	const ELEM_ID = "info-contents";

	//set the correct color
	if (document.getElementById(ELEM_ID) !== null && shouldHighlightTitle) { //the element is not yet found
		document.getElementById(ELEM_ID).style.backgroundColor = HIGHLIGHT_COLOR;
	}
	/*if (document.getElementById(ELEM_ID).style.backgroundColor === "" && shouldChange) { //the box is not highlighted but should be
		document.getElementById(ELEM_ID).style.backgroundColor = color;
	}
	else { //the box should not be highlighted
		document.getElementById(ELEM_ID).style.backgroundColor == "";
	}*/
}


//second reader

///http redirects -- make the requests yourself
	// log all urls that you see in this process and match them
	//mutation observer or mutation summary <-- use these libraries
//settings-- use chrome.storage
//file a bug saying that client side redirects are not supported
//inject the javascript into the page as a script tab-- use the MutationSummary.js
	// --make sure that Youtube is not changing the DOM constantly

//Make a schedule for when you want things done
// -- steps and when we want them done
//Step 1-- get affiliate marketing part done
//Search results, settings, etc.-- would also do this through loading each video, looking at html and then checking each url redirect-- if there is a thing return
//notify when done

//rule list parsers-- feed it the regex list and it will give you a parser

//make sure that any redirect does not load as a click-- this could be seen as click-farming- fraudalant
// do not lead to false clicks-- only check for header redirects
//make sure you are not actually setting headers-- this could set cookies, which could be illegal
//send some hardcoded useragent-- do not use the browser's user data
//use a very barebones 

//storage or cache

