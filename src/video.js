var NUM_RETRIES = 5;
var HIGHLIGHT_COLOR = "#fccdd3";
//element to highlight. This is the Title Box
var TITLE_ELEM_ID = "info-contents";
var SERVER_ADDRESS = "https://ovqz88jgqf.execute-api.us-west-2.amazonaws.com/default/SocialMediaEndorsements?url="
var TEST_ENSURE_ADDRESS = "https://lj71toig7l.execute-api.us-west-2.amazonaws.com/default/AdIntuitionTracker?user="

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
var turk_id = ""
var shouldLog = false;

function checkMTurkID() {
	chrome.storage.sync.get({
		mturkID: null,
	}, function(items) {
		var id = items.mturkID;
		if (id === null) {
			if (confirm("Are you participating in the user study? Press \"Ok\" if yes")) {
				shouldLog = true;
				var inputId = prompt("Please enter your Mechanical Turk ID", "abcd1234");
				chrome.storage.sync.set({
					mturkID: inputId,
				}, function() {
					turk_id = inputId;
					logMturkWatch("userAdd");
				});
			}
			else {
				shouldLog = false;
				chrome.storage.sync.set({
					mturkID: "notParticipating",
				}, function() {
					turk_id = inputId;
				});
			}
		}
		else {
			turk_id = id;
		}
	})
}

function logMturkWatch(actionStr) {
	if (shouldLog) {
		var xhr = new XMLHttpRequest();
		searchTerm = "watch?v="
		fullUrl = window.location.href
		urlEnding = fullUrl.substring(fullUrl.indexOf(searchTerm)+searchTerm.length)
		xhr.open("GET", TEST_ENSURE_ADDRESS + turk_id + "&action=" + actionStr +"&video=" + urlEnding, true);
		xhr.onload = function() {
			console.log(urlEnding + " sent to server");

		}
		xhr.send()
	}
}

checkMTurkID();
run();

function run() {
	getOptions();
	if (!document.getElementById("AdIntuitionMarker")) {
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

//bug when go to a video with no links-- then does not breakdown the bar
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
		chrome.runtime.sendMessage({"function": "getMutationSummary"});
		window.setTimeout(function() {addObserver();}, 20);
	}
}

function handleChanges(summaries) {
	remake();
	logMturkWatch("vidWatch");
	var desc = document.getElementById("description").getElementsByTagName('a');
	var haveSeenMatch = false;
	for (var i=0; i<desc.length; i++) {
		checkSponsored(i);
	}
}

function remake() {
	//remove the banner
	removeBanner();
	//reset the icon
	chrome.runtime.sendMessage({"function": "reset_icon", "icon":"logos/logo.png"});
	//un-highlight video title
	document.getElementById(TITLE_ELEM_ID).style.backgroundColor = "";
	//reset any highlighted links
	elems = document.getElementById("description").getElementsByTagName('a');
	for (var i=0; i<elems.length; i++) {
		elems[i].style.backgroundColor = "#FFFFFF";
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

	//send videoShown
	logMturkWatch("bannerShown");

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

function checkSponsored(index) {
	document.getElementById("description").getElementsByTagName('a')[index].style.backgroundColor = "#FFFFFF";
	var url = document.getElementById("description").getElementsByTagName('a')[index].innerHTML;
	checkRedirect(url, index);
}

function checkRedirect(url, index) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", SERVER_ADDRESS + url, true);
	xhr.onload = function() {
		console.log("code: " + xhr.status + " url: " + url);
		if (xhr.response === 'true') {
			//A match was found!!!
			addBanner("normal");
			document.getElementById("description").getElementsByTagName('a')[index].style.backgroundColor = HIGHLIGHT_COLOR;
		}
	}
	xhr.send();
}

function removeBanner() {
	var element = document.getElementById("AdIntuition");
	if (element) {
    	element.parentNode.removeChild(element);
    }
}

function highlightTitle() {
	if (document.getElementById(TITLE_ELEM_ID) !== null && shouldHighlightTitle) { //the element is not yet found
		document.getElementById(TITLE_ELEM_ID).style.backgroundColor = HIGHLIGHT_COLOR;
	}
}

