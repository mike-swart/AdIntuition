url = "http://themeleashow.com/BlueApron"

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
hasBeenCalled = false;
checkRedirect(url, 1);

function makeRequest(url) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		console.log("here");
		if (xhr.readyState !== 4) {return;}
		if (url != xhr.responseURL) {
			console.log(xhr.responseURL);
			makeRequest(url);
		}
		if (xhr.status >= 300 && xhr.status < 400) {
			console.log("300 level");
			console.log(xhr);
		}
	}
	xhr.send();
}

function checkRedirect(url, index) {
	// if (url.substring(0,5) === "http:") {
	// 	url = "https" + url.substring(4);
	// }
	// if (url.substring(0,6) !== "https:") {
	// 	return false
	// }
	console.log(url);
	makeRequest(url);
	//TODO: should probably check the url using regex or add a try/catch
	// var xhr = new XMLHttpRequest();
	// xhr.onreadystatechange = function(e) {
	// 	if (xhr.readyState !== 4) {return;}
	// 	console.log(xhr);
	// 	if (xhr.status === 300) {
	// 		console.log("300");
	// 		console.log(xhr);
	// 	}
	// 	if (xhr.status === 301) {
	// 		console.log("301");
	// 		console.log(xhr);
	// 	}
	// 	if (xhr.status === 302) {
	// 		console.log("302");
	// 		console.log(xhr);
	// 	}
	// 	if (xhr.status === 200 && xhr.readyState === 4) {
	// 		if (url != xhr.responseURL) {
	// 			console.log("here");
	// 			console.log(url + " --> " + xhr.responseURL);
	// 			var headers = xhr.getAllResponseHeaders();
	// 			checkRedirect(xhr.responseURL, index);
	// 		}
	// 	}
	// }
	// xhr.open("GET", url, true);
	// xhr.send();
}
