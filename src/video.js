var NUM_RETRIES = 5;
var HIGHLIGHT_COLOR = "#fccdd3";
var COUPON_HIGHLIGHT_COLOR = "#fcefce"
var UTM_HIGHLIGHT_COLOR = "#fce0ce"
//element to highlight. This is the Title Box
var TITLE_ELEM_ID = "info-contents";
var userId = null;
var TEST_ENSURE_ADDRESS = "https://lj71toig7l.execute-api.us-west-2.amazonaws.com/default/AdIntuitionTracker?user="

//text constants
const BANNER_NORMAL = "This video contains affiliate links. If you click on highlighted links, the creator receives a commission";
const BANNER_COUPON = "This video may contain affiliate marketing content. The creator may make a commission if you click on the highlighted portions of the description";
const BUTTON_NORMAL = "Exit";
const BANNER_OPTIONS = {
	"normal": {
		"text": BANNER_NORMAL,
		"button": BUTTON_NORMAL,
	},
	"coupon": {
		"text": BANNER_COUPON,
		"button": BUTTON_NORMAL,
	},
}

//settings
var shouldLog = true;
var shouldHighlightUTM = true;
var shouldHighlightAff = true;
var shouldHighlightCoupon = true;
var descHash = 0;

function highlightUrl(url, color) {
	var links = document.getElementById("AdIntuitionDescription").getElementsByTagName('a');
	for (var i=0; i<links.length; i++) {
		if (url === links[i].innerHTML) {
			document.getElementById("AdIntuitionDescription").getElementsByTagName('a')[i].style.backgroundColor = color;
		}
	}
}

browser.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.message === 'highlight') {
  	if (msg.type === 'true' && shouldHighlightAff) {
  		logAction("aff", msg.url);
  		addBanner("normal", HIGHLIGHT_COLOR);
		highlightUrl(msg.url, HIGHLIGHT_COLOR);
	}
	else if (msg.type === "utm" && shouldHighlightUTM) {
		logAction("utm", msg.url);
		addBanner("coupon", COUPON_HIGHLIGHT_COLOR);
		highlightUrl(msg.url, UTM_HIGHLIGHT_COLOR);
	}
}
});

run();

function getRandomId() {
	var value = "";
	var possibleValues = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for (var i=0; i<43; i++) {
		var index = Math.floor((Math.random()*possibleValues.length));
		value += possibleValues.charAt(index);
	}
	return value;
}

function getID() {
	browser.storage.local.get({
		userId: null,
	}, function(items) {
		var id = items.userId;
		if (id === null) {
			var generatedId = getRandomId();
			userId = generatedId;
			browser.storage.local.set({
				userId: generatedId,
			}, function() {});
			//if (confirm("Are you willing to share your data with AdIntuition to help improve the extension? You can always change your choice in the settings page.")) {
			shouldLog = true;
			logAction("userAdd", "");
			browser.storage.local.set({shouldLog: true});
			/*}
			else {
				shouldLog = false;
				chrome.storage.sync.set({shouldLog: false});
			}*/
		}
		else {
			userId = id;
		}
	})
}

function logAction(actionStr, highlightedPortion) {
	if (shouldLog) {
		searchTerm = "watch?v=";
		fullUrl = window.location.href;
		urlEnding = fullUrl.substring(fullUrl.indexOf(searchTerm)+searchTerm.length);
		var qUrl = TEST_ENSURE_ADDRESS + userId + "&action=" + actionStr + "&video=" + urlEnding + "&highlighted=" + encodeURIComponent(highlightedPortion);
		if (actionStr === "vidWatch" || actionStr === "userAdd") {
			qUrl = TEST_ENSURE_ADDRESS + userId + "&action=" + actionStr;
		}
		browser.runtime.sendMessage({"function": "logToServer", 'qUrl': qUrl});
	}
}

function run() {
	getID();
	getOptions();
	if (!document.getElementById("AdIntuitionMarker")) {
		addObserver();
	}
}

function getOptions() {
	browser.storage.local.get({
		shouldLog: true,
		shouldShowCoupons: true,
		shouldShowUTM: true,
		shouldShowAff: true,
	}, function(items) {
		shouldLog = items.shouldLog;
		shouldHighlightUTM = items.shouldShowUTM;
		shouldHighlightAff = items.shouldShowAff;
		shouldHighlightCoupon = items.shouldShowCoupons;
	});
}

//bug when go to a video with no links-- then does not breakdown the bar
function addObserver(){
	var elem = "yt-formatted-string";
	var observer = new MutationSummary({
		callback: waitForHandle,
		queries: [
			{ element: [elem]},
			{ element: elem},
		] //TODO: if no description is present, then these do not work-- need to figure out #description
	});
	var marker = document.createElement("div");
	marker.id = "AdIntuitionMarker";
	document.lastElementChild.appendChild(marker);
}

//make sure that the description has loaded
function waitForHandle(summaries) {
	if (document.getElementById("description")) {
		handleChanges(summaries);
	}
	else {
		setTimeout(() => {waitForHandle(summaries)}, 0100);
	}
}

//hash a string-- useful for checking if we have already checked a description
//taken from online
function hashCode(s) {
	var h = 0, l = s.length, i = 0;
	if ( l > 0 ) {
		while (i < l) {
			h = (h << 5) - h + s.charCodeAt(i++) | 0;
		}
	}
	return h;
};

function handleChanges(summaries) {
	var tempHash = hashCode(document.getElementById("description").children[0].innerHTML);
	if (tempHash === descHash) {
		return
	}
	descHash = tempHash;
	logAction("vidWatch", "");
	remake();
	document.getElementById("description").children[0].style.display = "none";
	if (document.getElementById("AdIntuitionDescription") === null) {
		var elem = document.createElement("div");
		elem.innerHTML = "AdIntuitionLoading";
		elem.id = "AdIntuitionDescription"
		document.getElementById("description").appendChild(elem)
	}
	while (document.getElementById("AdIntuitionDescription") === null) {continue;}
	var desc = document.getElementById("description").children[0].innerHTML;
	document.getElementById("AdIntuitionDescription").innerHTML = desc.replace(/\n/g, '<br>');
	var desc = document.getElementById("AdIntuitionDescription").getElementsByTagName('a');
	var haveSeenMatch = false;
	for (var i=0; i<desc.length; i++) {
		checkSponsored(i);
	}
	if (shouldHighlightCoupon) {
		checkForCouponCodes();
	}
}

function remake() {
	//remove the banner
	removeBanner();
	removeCouponBanner();
	//un-highlight video title
	document.getElementById(TITLE_ELEM_ID).style.backgroundColor = "";
}

function showDesktopNotification() {
	if (shouldShowDesktopNotification) {
		browser.runtime.sendMessage({"function": "open_desktop_notification"});
	}
}

function addBanner(bannerType, color) {
	if (bannerType === "normal") {
		//in case banner is not selected in settings, add another invisible tag
		if (document.getElementById("AdIntuition") !== null) {
			return;
		}
		if (document.getElementById("AdIntuitionCoupon") !== null) {
			removeCouponBanner();
		}
		const bannerConstants = BANNER_OPTIONS[bannerType];
		var banner = document.createElement("div");
		banner.innerHTML = "<div id='AdIntuition' style='background-color:" + color + "; padding-left:5px; padding-right:10px; padding-bottom:5px; padding-top:1px;'><span style='display:inline-block;'>"+ bannerConstants.text + "&nbsp&nbsp</span></div>";
		element = document.getElementById("masthead");
		element.parentNode.insertBefore(banner, element.nextSibling);
		var bannerButton = document.createElement("a");
		bannerButton.classList.add("bannerbutton");
		bannerButton.innerHTML = bannerConstants.button
		bannerButton.style.float = "right";
		bannerButton.onclick = (function() {removeBanner();})
		document.getElementById("AdIntuition").appendChild(bannerButton);
	}
	else if (bannerType === "coupon") {
		//in case banner is not selected in settings, add another invisible tag
		if (document.getElementById("AdIntuition") !== null || document.getElementById("AdIntuitionCoupon") !== null) {
			return;
		}
		const bannerConstants = BANNER_OPTIONS[bannerType];
		var banner = document.createElement("div");
		banner.innerHTML = "<div id='AdIntuitionCoupon' style='background-color:" + color + "; padding-left:5px; padding-right:10px; padding-bottom:5px; padding-top:1px;'><span style='display:inline-block;'>"+ bannerConstants.text + "&nbsp&nbsp</span></div>";
		element = document.getElementById("masthead");
		element.parentNode.insertBefore(banner, element.nextSibling);
		var bannerButton = document.createElement("a");
		bannerButton.classList.add("bannerbutton");
		bannerButton.innerHTML = bannerConstants.button
		bannerButton.style.float = "right";
		bannerButton.onclick = (function() {removeCouponBanner();})
		document.getElementById("AdIntuitionCoupon").appendChild(bannerButton);
	}
}

function checkSponsored(index) {
	document.getElementById("AdIntuitionDescription").getElementsByTagName('a')[index].style.backgroundColor = "#FFFFFF";
	var url = document.getElementById("AdIntuitionDescription").getElementsByTagName('a')[index].innerHTML;
	//filter out hashtags and empty values
	if (!url || url.substring(0,1) === "#") {
		return;
	}
	browser.runtime.sendMessage({"function": "checkRedirect", "url":url});
}

function removeBanner() {
	var element = document.getElementById("AdIntuition");
	if (element) {
    	element.parentNode.removeChild(element);
    }
}

function removeCouponBanner() {
	var element = document.getElementById("AdIntuitionCoupon");
	if (element) {
    	element.parentNode.removeChild(element);
    }
}

function stripLinksFromDesc(descString) {
	//replace with a newline so that each side will be counted as a different sentence
	descString = descString.replace(/<a class="yt-simple-endpoint style-scope yt-formatted-string.*?<\/a>/g, '\n');
	return descString;
}

//load it later because the page is not yet done loading-- the coupon code checks are done too quickly
async function asyncCallAddBanner() {
	setTimeout(() => {addBanner("coupon", COUPON_HIGHLIGHT_COLOR);}, 0200);
}

function checkForCouponCodes() {
	//get the description
	var descString = document.getElementById('AdIntuitionDescription').innerHTML.toString();
	var strippedDescString = stripLinksFromDesc(descString);
	var sentences = strippedDescString.split(/\n|\.|\r|<br>/);
	for(var i = 0; i < sentences.length; i++) {
		//check each sentence for a coupon code match
		if (sentences[i].length === 0) {
			continue;
		}
		var prediction = get_prediction(sentences[i]);
		if (prediction >= 1.5) {
			//highlight the portion of the description that we have a match in
			var highlightSentence = "<span style='background-color:" + COUPON_HIGHLIGHT_COLOR + "'>" + sentences[i] + "</span>";
			logAction("couponCode", sentences[i]);
			var newDescString = document.getElementById('AdIntuitionDescription').innerHTML;
			var startPos = newDescString.indexOf(sentences[i]);
			if (startPos < 0) {
				continue;
			}
			var endPos = startPos + sentences[i].length
			var newFinal = newDescString.substring(0, startPos) + highlightSentence + newDescString.substring(endPos);
			document.getElementById('AdIntuitionDescription').innerHTML = newFinal;
			asyncCallAddBanner();
		}
	}
}

