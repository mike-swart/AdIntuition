//import { MutationSummary } from 'mutation-summary/src/mutation-summary.js';

var NUM_RETRIES = 5;
//var HIGHLIGHT_COLOR = "#cfd1b1";
var HIGHLIGHT_COLOR = "#fccdd3";

//text constants
var BANNER_NORMAL = "AdIntuition detected a sponsorship in this video. Sponsored Links are highlighted in the description. Please click the AdIntuition icon above for more info.";
var BUTTON_NORMAL = "Exit";
var BANNER_RETRY = "AdIntuition did not load properly. Click to retry";
var BUTTON_RETRY = "Retry";
var BANNER_OPTIONS = {
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

// function observeMutations(mutations) {
// 	console.log(mutations);
// }

// function callObserve() {
// 	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
// 	observer = new MutationObserver(observeMutations);
// 	var elem = document.getElementById('description');
// 	observer.observe(elem, { childList: true, subtree: true});
// }

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
	//callObserve();
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

// function addCSS() {
// 	var head = document.getElementsByTagName('head')[0];
//     var link = document.createElement('link');
//     //link.id = "myCss";
//     link.rel = 'stylesheet';
//     link.type = 'text/css';
//     link.href = 'common.css';
//     console.log(link.href);
//     //link.media = 'all';
//     head.appendChild(link);
// }

function addBanner(bannerType) {
	//addCSS();
	const bannerConstants = BANNER_OPTIONS[bannerType];
	var banner = document.createElement("div");
	banner.innerHTML = "<div id='AdIntuition' style='background-color:" + HIGHLIGHT_COLOR + "; text-align:right; padding-right:10px;'>"+ bannerConstants.text + "&nbsp&nbsp</div>";
	element = document.getElementById("masthead");
	element.parentNode.insertBefore(banner, element.nextSibling);
	var bannerButton = document.createElement("button");
	// bannerButton.href = "#";
	// bannerButton.class = "button";
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
	const bitlyPattern = new RegExp("/*://bit.ly/*");
	document.getElementById("description").getElementsByTagName('a')[index].style.backgroundColor = "#FFFFFF";
	var url = document.getElementById("description").getElementsByTagName('a')[index].innerHTML;
	var req = new Request(url);
	chrome.runtime.sendMessage({"function": "url_check", "url": url});
	if (bitlyPattern.exec(url) !== null) {
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

