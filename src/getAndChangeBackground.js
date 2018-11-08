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


var observer = null;

run();

function run() {
	getOptions();
	if (!observer) {
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

function addObserver(){
	try {
		observer = new MutationSummary({
			callback: handleChanges,
			queries: [
				{ element: ["yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer"]},
				{ element: "yt-formatted-string.content.style-scope.ytd-video-secondary-info-renderer"},
			] //TODO: if no description is present, then these do not work-- need to figure out #description
		});
		console.log("made it");
		//TODO: if this is called on the second pass, description may already have been changed-- could be worth checking
		//maybe could slightly edit desc...
	}
	catch(err) {
		//with the background resources dict, this should not be necessary
		console.log("catching");
		chrome.runtime.sendMessage({"function": "getMutationSummary"});
		window.setTimeout(function() {ms();}, 1);
	}
}

function handleChanges(summaries) {
	//getOptions();
	console.log(summaries[0].added);
	var disclosureWasPresent = editDescription(document.getElementById("description").getElementsByTagName('a'));
}

function remake() {
	removeBanner();
	chrome.runtime.sendMessage({"function": "reset_icon", "icon":"logos/logo.png"});
	elems = document.getElementById("description").getElementsByTagName('a');
	for (var i=0; i<elems.length; i++) {
		elem.style.backgroundColor = "#FFFFFF";
	}
}

// function addCSS() {
// 	var head = document.getElementsByTagName('head')[0];
//     var link = document.createElement('link');
//     //link.id = "myCss";
//     link.rel = 'stylesheet';
//     link.type = 'text/css';
//     link.href = 'chrome-extension://pjhkaoijehhploklnfnoohicfjpcnebf/common.css';
//     head.appendChild(link);
//     console.log("here");
// }

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
	bannerButton.href = "#";
	bannerButton.classList.add("bannerbutton");
	bannerButton.innerHTML = bannerConstants.button
	bannerButton.onclick = (function() {removeBanner();})
	document.getElementById("AdIntuition").appendChild(bannerButton);
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

function editDescription(desc) {
	removeBanner();
	var haveSeenMatch = false;
	for (var i=0; i<desc.length; i++) {
		var check = checkSponsored(i);
		if (check) {
			haveSeenMatch = true;
		}
	}
	return haveSeenMatch;
}

function checkSponsored(index) {
	const bitlyPattern = new RegExp("https://");
	document.getElementById("description").getElementsByTagName('a')[index].style.backgroundColor = "#FFFFFF";
	var url = document.getElementById("description").getElementsByTagName('a')[index].innerHTML;
	var wasRedirect = checkRedirect(url, index);
	if (wasRedirect) {
		/*document.getElementById("description").getElementsByTagName('a')[index].onmouseover = (function() {
			document.getElementById("AdIntuition").style.backgroundColor = getRandomColor();
		});
		document.getElementById("description").getElementsByTagName('a')[index].onmouseout = (function(){
			document.getElementById("AdIntuition").style.backgroundColor = HIGHLIGHT_COLOR;
		});*/
		document.getElementById("description").getElementsByTagName('a')[index].style.backgroundColor = HIGHLIGHT_COLOR;
		return true;
	}
	return false;
}

function checkRedirect(url, index) {
	if (url.substring(0,5) === "http:") {
		url = "https" + url.substring(4);
	}
	console.log(url);
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(e) {
		if (xhr.status == 200 && xhr.readyState == 4) {
			if (url != xhr.responseURL) {
				addBanner("normal");
				console.log(url + " --> " + xhr.responseURL);
				var headers = xhr.getAllResponseHeaders();
				//console.log(headers);
				document.getElementById("description").getElementsByTagName('a')[index].style.backgroundColor = HIGHLIGHT_COLOR;
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
//Search results, settings, etc.
//notify when done

//rule list parsers-- feed it the regex list and it will give you a parser

