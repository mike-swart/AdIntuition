function checkRedirects(url) {
	// var wind = window.open(chrome.runtime.getURL('options.html'), "adintuition")// 'location=true,height=500,width=500,scrollbars=yes,status=yes');
	// console.log(wind.location.href);
	// wind.locationbar.visible = true;
	// wind.onhashchange = function() { 
	// 	console.log(window.location.href);
	// }
	// setTimeout(() => {wind.close();}, 5000);

	// console.log("checking: " + url);
	// var req = new Request(url, {"redirect": "manual"});
	// fetch(req).then(function(response) {
	// 	console.log(response);
	// 	if (response.type === "opaqueredirect") {
	// 		console.log(url + "  ->  " + response.url);
	// 		//checkRedirects(response.url);
	// 	}
	// 	return false;
	// })
}

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
	else if (message.function === "getEncodedUrl") {
		//generate symmetric keys
		var key = CryptoJS.enc.Hex.parse(getRandomString());
		var iv = CryptoJS.enc.Hex.parse(getRandomString());

		//encrpt the url
		var encryptedStr = CryptoJS.AES.encrypt(message.url, key, {mode: CryptoJS.mode.CTR, iv:iv});

		//encyrpt the keys
		var encrypt = new JSEncrypt();
		encrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtuUTP8432z2+e80YoTZaeW8i/0PmocUAXIRuXst2Qp/13c1xWTmkGUhuuCxoh6U0mCzAR5NZUORcEQMlMO18Eh4IBElyvgWu6kKZfK7ypWc+5mrtzpRz49MdUZx5vXkeclFrPUKswAN8ZNONt1VXVWyKeq5lbWmYirOvxu6DuQIDAQAB")
		var jointStr = key + "|" + iv;
		var encryptedKeys = encrypt.encrypt(jointStr);

		//prepare the query string
		var qString = "data=" + encryptedStr.toString() + "&key=" + encryptedKeys;
		qString = qString.split("+").join("%2B");
		sendResponse({"urlQueryString": qString})
	}
	else if (message.function === "checkRedirects") {
		checkRedirects(message.url);
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
