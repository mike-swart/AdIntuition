const NUM_RETRIES = 1;
const HIGHLIGHT_COLOR = "#cfd1b1";

//text constants
const BANNER_NORMAL = "AdIntuition detected a sponsorship in this video. Sponsored Links are highlighted in the description. Please click the AdIntuition icon above for more info.";
const BUTTON_NORMAL = "Exit";
const BANNER_RETRY = "AdIntuition did not load properly. Click to retry";
const BUTTON_RETRY = "Retry";
const BANNER_OPTIONS = {
	"normal": {
		"text": BANNER_NORMAL,
		"button": BUTTON_NORMAL,
	},
	"retry": {
		"text": BANNER_RETRY,
		"button": BUTTON_RETRY,
	},
}

window.setTimeout(function() {changeInfo(0, NUM_RETRIES);}, 1000);

function changeInfo(retryNum, numRetries) {
	if (retryNum === numRetries) { //could not load the page
		console.log("Could Not Load");
		addBanner("retry");
		return
	}
	if (document.getElementById("description") === null) { //the description has not loaded yet
		window.setTimeout(function() {changeInfo(retryNum + 1, numRetries);}, 1000);
		return
	}
	//maybe use a promise chain to remake and then create
	var disclosureWasPresent = editDescription(document.getElementById("description").getElementsByTagName('a'));
	// highlight(0, disclosureWasPresent);
	if (disclosureWasPresent) {
		rotateIcon(0);
		addBanner("normal");
	}
	else {
		remake();
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

function addBanner(bannerType) {
	const bannerConstants = BANNER_OPTIONS[bannerType];
	var banner = document.createElement("div");
	banner.innerHTML = "<div id='AdIntuition' style='background-color:" + HIGHLIGHT_COLOR + "; text-align:right; padding-right:10px;'>"+ bannerConstants.text + "&nbsp&nbsp</div>";
	element = document.getElementById("masthead");
	element.parentNode.insertBefore(banner, element.nextSibling);
	var bannerButton = document.createElement("button");
	bannerButton.innerHTML = bannerConstants.button
	if (bannerType === "retry") {
		bannerButton.onclick = (function() {removeBanner();changeInfo(0, NUM_RETRIES);})
	}
	else {
		bannerButton.onclick = (function() {removeBanner();})
	}
	document.getElementById("AdIntuition").appendChild(bannerButton);
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
	const bitlyPattern = new RegExp("http://bit.ly/*");
	if (bitlyPattern.exec(document.getElementById("description").getElementsByTagName('a')[index].innerHTML) !== null) {
		document.getElementById("description").getElementsByTagName('a')[index].onmouseover = (function() {
			document.getElementById("AdIntuition").style.backgroundColor = getRandomColor();
		});
		document.getElementById("description").getElementsByTagName('a')[index].onmouseout = (function(){
			document.getElementById("AdIntuition").style.backgroundColor = HIGHLIGHT_COLOR;
		});
		document.getElementById("description").getElementsByTagName('a')[index].style.backgroundColor = HIGHLIGHT_COLOR;
		return true;
	}
	return false;
}

function getRandomColor(){
	var str = "#";
	var possibleVals = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E"];
	for (var i=0; i<6;i++) {
		str += possibleVals[Math.floor(Math.random() * possibleVals.length)];
	}
	return str;
}

function removeBanner() {
	var element = document.getElementById("AdIntuition");
	if (element) {
    	element.parentNode.removeChild(element);
    }
}

function highlight(retryNum, shouldChange) {
	//element to highlight. This is the Title Box
	const ELEM_ID = "info-contents";
	console.log("highlight");

	//set the correct color
	var color = "#000000";
	if (shouldChange) {color = getRandomColor();}

	if (retryNum === NUM_RETRIES) { //the page is not loading
		console.log("Could Not Highlight");
		return
	}
	if (document.getElementById(ELEM_ID) === null) { //the element is not yet found
		window.setTimeout(function() {highlight(retryNum + 1);}, 1000);
		return
	}
	if (document.getElementById(ELEM_ID).style.backgroundColor === "" && shouldChange) { //the box is not highlighted but should be
		document.getElementById(ELEM_ID).style.backgroundColor = color;
	}
	else { //the box should not be highlighted
		document.getElementById(ELEM_ID).style.backgroundColor == "";
	}
}


