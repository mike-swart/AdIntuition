var reqIdToUrl = {};
var urlToResponse = {};
var urlToTabId = {};
var reloadThreshold = 1800000; //30 mins
var timeOfLastReload = Number.MAX_SAFE_INTEGER;
//var couponWeights = [-0.00004024931794063161, -0.00010751554319488044, -0.00004024931794063161, -0.00010013418298060461, 0.06317326467600226092, -0.00004849033516842100, -0.00016121731910465363, -0.00022428489804823953, -0.00414943683253530225, -0.00196938132587157330, -0.48280156293920778454, 0.06325285757728138503, 2.06319940055031603166, -0.00196938132587157330, 2.06303345003142091230, 1.85015223272053264125, 0.27713251413690170866, 0.06287894267645621760, 0.21305005355398237699, -0.00009745635220902041, -0.00004432204447751592, -0.00016121731910465363, -0.00522407494479172532, -1.00000000000000000000, -0.00004024931794063161, -1.00000000000000000000, -0.03137956739307986437, -0.00010013418298060461, 0.06315151856053347057, -0.33984266037397325988, 0.08067820323181328079, 0.06278289495700138667, -0.01044814988958345063, 0.06321178855180320522, -0.00009745635220902041, -0.00020384265051222222, -0.09711063275968855046, -0.08965651952528118362, -0.00004432204447751592, -0.00004024931794063161, -0.00986614921021462116, -0.01764809886606554315, -0.00004432204447751592, -0.00789676788434304743, 0.06327300884958853011, -0.09711063275968855046, -0.00004702572664523619, -0.00937351177732702670, -0.01567222483437517508, -0.00009745635220902041, -0.07146004546262424428, -0.00004432204447751592, -0.11661325605548721052, -0.03137956739307986437, -0.00522407494479172532, 0.06329927934533863265, -0.09711063275968855046, -0.46267455828353232228, -0.00009745635220902041, 0.45138112019019904775, -0.46267455828353232228, -0.45150824705011238791, 0.06291308866960682034, -0.00196938132587157330, -0.00004024931794063161, -0.00522407494479172532, -0.00004024931794063161, -0.07146004546262424428, -0.00009698067033684201, -0.00009745635220902041, -1.00000000000000000000, 0.00026463554294342551, -1.00000000000000000000, 0.02695673653020602342, -0.00522407494479172532, -0.46267455828353232228, -0.00414943683253530225, 0.20633509751246847941, -0.00004432204447751592, -0.46267455828353232228, -0.09711063275968855046, -0.00196938132587157330];
//var couponFeatures = ["access","also","audio","auto","available","best","bmw","call","case","channel","cheap","check","checkout","click","code","codes","coupon","day","discount","download","easy","exclusive","experience","fair","features","fifa","food","ford","free","game","get","go","great","help","high","honda","house","join","learn","like","live","making","many","media","microsoft","mix","music","new","nissan","official","old","phone","player","pop","price","psn","radio","read","release","save","show","site","store","subscribe","system","team","touch","toys","traffic","tv","us","use","used","using","vehicle","video","wa","want","way","without","world","youtube"];
couponWeights = []
couponFeatures = []
var affRegex = "(ad.admitad.com/g/)|(ad.admitad.com/goto/)|(performance.affiliaxe.com/.*\\?aff_id=)|(performance.affiliaxe.com/.*&aff_id=)|(s.aliexpress.com/.*\\?af=)|(s.aliexpress.com/.*&af=)|(amazon.com/.*\\?tag=)|(amazon.com/.*&tag=)|(amazon.de/.*\\?tag=)|(amazon.de/.*&tag=)|(amazon.it/.*\\?tag=)|(amazon.it/.*&tag=)|(amazon.in/.*\\?tag=)|(amazon.in/.*&tag=)|(amazon.fr/.*\\?tag=)|(amazon.fr/.*&tag=)|(primevideo.com/.*\\?ref=)|(primevideo.com/.*&ref=)|(itunes.apple.com/.*\\?at=)|(itunes.apple.com/.*&at=)|(apple.com/.*\\?afid=)|(apple.com/.*&afid=)|(affiliates.audiobooks.com/.*\\?a_aid=.*&a_bid=)|(affiliates.audiobooks.com/.*\\?a_bid=.*&a_aid=)|(affiliates.audiobooks.com/.*&a_bid=.*&a_aid=)|(avantlink.com/.*\\?pw=)|(avantlink.com/.*&pw=)|(secure.avangate.com/.*\\?affiliate=)|(secure.avangate.com/.*&affiliate=)|(awin1.com/.*\\?awinaffid=)|(awin1.com/.*&awinaffid=)|(ad.zanox.com/ppc^)|(zenaps.com/rclick.php\\?)|(banggood.com/.*\\?p=)|(banggood.com/.*&p=)|(bookdepository.com/.*\\?a_aid=)|(bookdepository.com/.*&a_aid=)|(booking.com/.*\\?aid=)|(booking.com/.*&aid=)|(hop.clickbank.net^)|(anrdoezrs.net/click-)|(cj.dotomi.com^)|(dpbolvw.net/click-)|(emjcd.com^)|(jdoqocy.com/click-)|(kqzyfj.com/click-)|(qksrv.net^)|(tkqlhce.com/click-)|(designmodo.com/\\?u=)|(rover.ebay.com/.*\\?campid=)|(rover.ebay.com/.*&campid=)|(audiojungle.net/.*\\?ref=)|(audiojungle.net/.*&ref=)|(codecanyon.net/.*\\?ref=)|(codecanyon.net/.*&ref=)|(marketplace.envato.com/.*\\?ref=)|(marketplace.envato.com/.*&ref=)|(graphicriver.net/.*\\?ref=)|(graphicriver.net/.*&ref=)|(themeforest.net/.*\\?ref=)|(themeforest.net/.*&ref=)|(videohive.net/.*\\?ref=)|(videohive.net/.*&ref=)|(buyeasy.by/cashback/)|(buyeasy.by/redirect/)|(flipkart.com/.*\\?affid=)|(flipkart.com/.*&affid=)|(gtomegaracing.com/.*\\?tracking=)|(gtomegaracing.com/.*&tracking=)|(search.hotellook.com/.*\\?marker=)|(search.hotellook.com/.*&marker=)|(hotmart.net.br/.*\\?a=)|(hotmart.net.br/.*&a=)|(7eer.net/c/)|(evyy.net/c/)|(kontrolfreek.com/.*\\?a_aid=)|(kontrolfreek.com/.*&a_aid=)|(online.ladbrokes.com/promoRedirect\\?key=)|(online.ladbrokes.com/promoRedirect\\?.*&key=)|(makeupgeek.com/.*\\?acc=)|(makeupgeek.com/.*&acc=)|(gopjn.com/t/)|(pjatr.com/t/)|(pjtra.com/t/)|(pntra.com/t/)|(pntrac.com/t/)|(pntrs.com/t/)|(click.linksynergy.com/.*\\?id=)|(click.linksynergy.com/.*&id=)|(go.redirectingat.com/.*\\?id=)|(go.redirectingat.com/.*&id=)|(olymptrade.com/.*\\?affiliate_id=)|(olymptrade.com/.*&affiliate_id=)|(rstyle.me^)|(shopstyle.it^)|(shareasale.com/r.cfm^)|(shareasale.com/m-pr.cfm^)|(shareasale.com/u.cfm^)|(apessay.com/.*\\?rid=)|(apessay.com/.*&rid=)|(tatacliq.com/.*\\?cid=af:)|(tatacliq.com/.*&cid=af:)|(thermoworks.com/.*\\?tw=)|(thermoworks.com/.*&tw=)|(zaful.com/.*\\?lkid=)|(zaful.com/.*&lkid=)";
var utmRegex = "((utm_source=.*)|(utm_term=.*)|(utm_campaign=.*)|(utm_content=.*)|(utm_medium=.*)|(aff_id=.*)|(campaignid=.*)){1}";
function getTabId(url) {
	var tab = urlToTabId[url];
	if (tab) {return tab;}
	var newUrl = url.substring(0,4) + url.substring(5);
	tab = urlToTabId[newUrl];
	return tab;
}

function sendBackValue(reqId) {
	var url = reqIdToUrl[reqId];
	var response = urlToResponse[url];

	delete reqIdToUrl[reqId];
	delete urlToResponse[url];

	//tabId might not have the same Id
	var tab = urlToTabId[url];
	if (!tab) {
		//the original might have been http:// not https://
		var newUrl = url.substring(0,4) + url.substring(5);
		tab = urlToTabId[newUrl];
		if (!tab) {
			//check for changing of cases-- need to check all keys but list is relatively small
			for (key in urlToTabId) {
				if (key.toLowerCase() === url.toLowerCase()) {
					tab = urlToTabId[key];
					newUrl = key;
					if (!tab) {
						newUrl = url.substring(0,4) + url.substring(5);
						tab = urlToTabId[newUrl];
						url = newUrl;
						if (!tab) {
							console.log("Cannot find original tab");
							return;
						}
					}
					else {
						//the key was found-- change the url to check for in the description
						url = newUrl;
					}
				}
			}
		}
		else {
			//the https: -> http: fix worked-- change the url to check for in the description
			url = newUrl;
		}
	}

	delete urlToTabId[url];
	if (response !== 'false') {
		var message = {'message': 'highlight', 'url': url, 'type': response};
		//console.log(tab + "\t" + JSON.stringify(message));
		chrome.tabs.sendMessage(tab, message);
	}
}

function getUrlFromReqId(reqId, url) {
	if (!(reqId in reqIdToUrl)) {
		reqIdToUrl[reqId] = url;
		urlToResponse[url] = 'false';
	}
	return reqIdToUrl[reqId];
}

function checkForRedirects(info) {
	var url = info.url
	var reqId = info.requestId
	var redirects = checkRedirectsAndMatches(url, affRegex, utmRegex);
	var urlOriginal = getUrlFromReqId(reqId, url);
	//console.log(info.statusCode + "\t" + url);
	if (redirects === 'true') {
		urlToResponse[urlOriginal] = 'true';
	}
	else if (redirects === 'utm') {
		if (urlToResponse[urlOriginal] === 'false') {
			urlToResponse[urlOriginal] = 'utm';
		}
	}
}

chrome.webRequest.onHeadersReceived.addListener(
    function(info) {
    	var from = "";
    	if (info && info.initiator) {
    		 from = info.initiator;
    	}
    	var ext = "chrome-extension://" + chrome.runtime.id;
    	if (from === ext) {
    		//do not want to track for the data updates
    		var tempStr = "https://mike-swart.github.io";
    		if (info.url.substring(0, tempStr.length) === tempStr) {
    			return;
    		}

    		//if redirect
      		if (info.statusCode && info.statusCode >= 300 && info.statusCode < 400) {
      			checkForRedirects(info);
      		}
      		else { //end of redirect chain
      			checkForRedirects(info);
      			sendBackValue(info.requestId);
      		}
      	}
    },
    {
        urls: ['http://*/*', "https://*/*"], //valid urls
    },
    ['extraHeaders']
);

function getRandomString() {
	const possibleVals = "1234567890ABCDEF";
	var totString = ""
	for(var i = 0; i < 32; i++) {
		totString += possibleVals.charAt(Math.floor(Math.random() * possibleVals.length));
	}
	return totString
}

//listen to messages
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (!message.function) {
		console.log("Unknown Message Function");
	}
	else if (message.function === "checkRedirect") {
		var url = message.url;
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		if (!(url in urlToTabId)) {
			urlToTabId[url] = sender.tab.id;
		}
		//xhr.onload = function() {}
		xhr.send();
	}
	else if (message.function === "getCouponFeaturesAndWeights") {
		var currentTime = new Date().getTime();
		if (currentTime - timeOfLastReload > reloadThreshold) {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "https://mike-swart.github.io/AdIntutionData/features-and-regex.json", true);
			xhr.onload = function() {
				var data = JSON.parse(this.responseText);
				couponFeatures = data.couponFeatures;
				couponWeights = data.couponWeights;
				sendResponse({"features": couponFeatures, "weights": couponWeights});
				affRegex = data.knownAffiliateLinksRegexString;
				utmRegex = data.utmLinksRegexString;
				timeOfLastReload = currentTime;
			}
			xhr.send();
		}
		else {
			sendResponse({"features": couponFeatures, "weights": couponWeights});
		}
	}
	else if (message.function === "change_icon") {
		chrome.browserAction.setBadgeText({"text": "open", "tabId": sender.tab.id});
		chrome.browserAction.setBadgeBackgroundColor({"color": "#cfd1b1", "tabId": sender.tab.id});
		chrome.browserAction.setIcon({"path":message.icon, "tabId": sender.tab.id});
	}
	else if (message.function === "play_sound") {
		var sound = new Audio();
		sound.src = 'beat2.wav';
		sound.play();
		//uncomment this to play 2 beeps instead of 1
		//window.setTimeout(function() {sound.play();}, 500);
	}
	else if (message.function === "reset_icon") {
		chrome.browserAction.setBadgeText({"text": "", "tabId": sender.tab.id});
		chrome.browserAction.setBadgeBackgroundColor({"color": "#FFFFFF", "tabId": sender.tab.id});
		chrome.browserAction.setIcon({"path":message.icon, "tabId": sender.tab.id});
	}
	else if (message.function === "log") {
		console.log(message.message);
	}
	else if (message.function === "open_desktop_notification") {
		const notification_options = {
		    "type": 'basic',
		    "iconUrl": "logos/logo.png",
		    "title": 'AdIntuition',
		    "message": 'This page has sponsored content',
 		};
		chrome.notifications.create('reminder', notification_options, function(notificationId) {});
	}
});

//clean up the dictionaries-- this should not be necessary
chrome.tabs.onRemoved.addListener(function(tabId, info) {
	for (key in urlToTabId) {
		if (urlToTabId[key] === tabId) {
			delete urlToTabId[key];
		}
}
});

