var NUM_RETRIES = 5;
var HIGHLIGHT_COLOR = "#fccdd3";
var SERVER_ADDRESS = "https://2f6221a3.ngrok.io"

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
		//console.log(err);
		chrome.runtime.sendMessage({"function": "getMutationSummary"});
		window.setTimeout(function() {addObserver();}, 20);
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
	var xhr = new XMLHttpRequest();
	xhr.open("GET", SERVER_ADDRESS + "/?url=" + url, true);
	xhr.onload = function() {
		if (xhr.response === 'true') {
			//A match was found!!!
			addBanner("normal");
			document.getElementById("description").getElementsByTagName('a')[index].style.backgroundColor = HIGHLIGHT_COLOR;
		}
	}
	xhr.send();
}

function urlMatches(url) {
	//check in the ../extra directory to see how we got this string
	const str = "(ad.admitad.com/g/)|(ad.admitad.com/goto/)|(performance.affiliaxe.com/.*\\?aff_id=)|(performance.affiliaxe.com/.*&aff_id=)|(s.aliexpress.com/.*\\?af=)|(s.aliexpress.com/.*&af=)|(amazon.com/.*\\?tag=)|(amazon.com/.*&tag=)|(amazon.de/.*\\?tag=)|(amazon.de/.*&tag=)|(amazon.it/.*\\?tag=)|(amazon.it/.*&tag=)|(amazon.in/.*\\?tag=)|(amazon.in/.*&tag=)|(amazon.fr/.*\\?tag=)|(amazon.fr/.*&tag=)|(primevideo.com/.*\\?ref=)|(primevideo.com/.*&ref=)|(itunes.apple.com/.*\\?at=)|(itunes.apple.com/.*&at=)|(apple.com/.*\\?afid=)|(apple.com/.*&afid=)|(affiliates.audiobooks.com/.*\\?a_aid=.*&a_bid=)|(affiliates.audiobooks.com/.*\\?a_bid=.*&a_aid=)|(affiliates.audiobooks.com/.*&a_bid=.*&a_aid=)|(avantlink.com/.*\\?pw=)|(avantlink.com/.*&pw=)|(secure.avangate.com/.*\\?affiliate=)|(secure.avangate.com/.*&affiliate=)|(awin1.com/.*\\?awinaffid=)|(awin1.com/.*&awinaffid=)|(ad.zanox.com/ppc^)|(zenaps.com/rclick.php\\?)|(banggood.com/.*\\?p=)|(banggood.com/.*&p=)|(bookdepository.com/.*\\?a_aid=)|(bookdepository.com/.*&a_aid=)|(booking.com/.*\\?aid=)|(booking.com/.*&aid=)|(hop.clickbank.net^)|(anrdoezrs.net/click-)|(cj.dotomi.com^)|(dpbolvw.net/click-)|(emjcd.com^)|(jdoqocy.com/click-)|(kqzyfj.com/click-)|(qksrv.net^)|(tkqlhce.com/click-)|(designmodo.com/\\?u=)|(rover.ebay.com/.*\\?campid=)|(rover.ebay.com/.*&campid=)|(audiojungle.net/.*\\?ref=)|(audiojungle.net/.*&ref=)|(codecanyon.net/.*\\?ref=)|(codecanyon.net/.*&ref=)|(marketplace.envato.com/.*\\?ref=)|(marketplace.envato.com/.*&ref=)|(graphicriver.net/.*\\?ref=)|(graphicriver.net/.*&ref=)|(themeforest.net/.*\\?ref=)|(themeforest.net/.*&ref=)|(videohive.net/.*\\?ref=)|(videohive.net/.*&ref=)|(buyeasy.by/cashback/)|(buyeasy.by/redirect/)|(flipkart.com/.*\\?affid=)|(flipkart.com/.*&affid=)|(gtomegaracing.com/.*\\?tracking=)|(gtomegaracing.com/.*&tracking=)|(search.hotellook.com/.*\\?marker=)|(search.hotellook.com/.*&marker=)|(hotmart.net.br/.*\\?a=)|(hotmart.net.br/.*&a=)|(7eer.net/c/)|(evyy.net/c/)|(kontrolfreek.com/.*\\?a_aid=)|(kontrolfreek.com/.*&a_aid=)|(online.ladbrokes.com/promoRedirect\\?key=)|(online.ladbrokes.com/promoRedirect\\?.*&key=)|(makeupgeek.com/.*\\?acc=)|(makeupgeek.com/.*&acc=)|(gopjn.com/t/)|(pjatr.com/t/)|(pjtra.com/t/)|(pntra.com/t/)|(pntrac.com/t/)|(pntrs.com/t/)|(click.linksynergy.com/.*\\?id=)|(click.linksynergy.com/.*&id=)|(go.redirectingat.com/.*\\?id=)|(go.redirectingat.com/.*&id=)|(olymptrade.com/.*\\?affiliate_id=)|(olymptrade.com/.*&affiliate_id=)|(rstyle.me^)|(shopstyle.it^)|(shareasale.com/r.cfm^)|(shareasale.com/m-pr.cfm^)|(shareasale.com/u.cfm^)|(apessay.com/.*\\?rid=)|(apessay.com/.*&rid=)|(tatacliq.com/.*\\?cid=af:)|(tatacliq.com/.*&cid=af:)|(thermoworks.com/.*\\?tw=)|(thermoworks.com/.*&tw=)|(zaful.com/.*\\?lkid=)|(zaful.com/.*&lkid=)";
	return searchPattern.test(url)
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

//still need to make sure that it loads for all videos and all page loading patterns (for example, does not clear after all the time)
//tear down correctly shoud fix this
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

