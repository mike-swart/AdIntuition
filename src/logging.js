function logAction(actionStr, highlightedPortion) {
	if (shouldLog) {
		searchTerm = "watch?v=";
		fullUrl = window.location.href;
		urlEnding = fullUrl.substring(fullUrl.indexOf(searchTerm)+searchTerm.length);
		var qUrl = TEST_ENSURE_ADDRESS + userId + "&action=" + actionStr + "&video=" + urlEnding + "&highlighted=" + encodeURIComponent(highlightedPortion);
		if (actionStr === "vidWatch" || actionStr === "userAdd") {
			qUrl = TEST_ENSURE_ADDRESS + userId + "&action=" + actionStr;
		}
		chrome.runtime.sendMessage({"function": "logToServer", 'qUrl': qUrl});
	}
}

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
	console.log("getting ID");
	chrome.storage.sync.get({
		userId: null,
	}, function(items) {
		var id = items.userId;
		if (id === null) {
			var generatedId = getRandomId();
			userId = generatedId;
			chrome.storage.sync.set({
				userId: generatedId,
			}, function() {});
			//if (confirm("Are you willing to share your data with AdIntuition to help improve the extension? You can always change your choice in the settings page.")) {
			shouldLog = true;
			logAction("userAdd", "");
			chrome.storage.sync.set({shouldLog: true});
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
