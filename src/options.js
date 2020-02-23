var userID = 0;

function saveSettings() {
	var coups = document.getElementById('coupons').checked;
	var utms = document.getElementById('utm').checked;
	var affs = document.getElementById('aff').checked;
	if (!coups && !utms && !affs) {
		alert("At least one Affiliate Marketing type must be checked");
		return;
	}
	chrome.storage.sync.set({
		shouldLog: sendData,
		shouldShowCoupons: coups,
		shouldShowUTM: utms,
		shouldShowAff: affs,
	}, function() {
		console.log('saved settings');
	});
	window.close();
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		shouldShowCoupons: true,
		shouldShowUTM: true,
		shouldShowAff: true,
		userId: 0,
	}, function(items) {
		document.getElementById('coupons').checked = items.shouldShowCoupons;
		document.getElementById('utm').checked = items.shouldShowUTM;
		document.getElementById('aff').checked = items.shouldShowAff;
		userID = items.userId;
	});
	deleteSelector = document.getElementById('deleteNumber');
	var numbers = [0,1,2,5,10,20,25];
	for (var i=0; i<numbers.length; i++) {	
		var opt = document.createElement('option');
		opt.appendChild(document.createTextNode(numbers[i]));
		opt.value = numbers[i];
		deleteSelector.appendChild(opt);
	}
}

function playSound() {
	chrome.runtime.sendMessage({"function": "play_sound"});
}

function cancel() {
	window.close();
}

function downloadData() {
	var xhr = new XMLHttpRequest();
	var url = "https://lj71toig7l.execute-api.us-west-2.amazonaws.com/default/AdIntuitionTracker?user=" + userID + "&action=getUserData";
	xhr.open("GET", url, true);
	xhr.onload = function() {
		items = JSON.parse(this.responseText)['userData']['elems'];
		var csvContent = "data:text/csv;charset=utf-8,";
		csvContent += "User ID,Transaction ID,Action,Timestamp,Video ID,Highlighted Text\n";
		for (var i=0; i<items.length; i++) {
			item = items[i];
			csvContent += item['UserId'] + ",";
			csvContent += item['xid'] + ",";
			csvContent += item['action'] + ",";
			csvContent += item['time'] + ",";
			var vid = "";
			if ('video' in item) {vid = item['video'];}
			csvContent += vid + ",";
			var htext = "";
			if ('highlighted' in item) {htext = item['highlighted'];}
			csvContent += htext + "\n";
		}
		var encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "MyAdIntuitionData.csv");
		document.body.appendChild(link);
		link.click();
	}
	xhr.send()
}

function deleteData() {
	var xhr = new XMLHttpRequest();
	var url = "https://lj71toig7l.execute-api.us-west-2.amazonaws.com/default/AdIntuitionTracker?user=" + userID + "&action=deleteItems&number=";
	url += document.getElementById('deleteNumber').value
	xhr.open("GET", url, true);
	xhr.onload = function() {
		document.getElementById('deleteData').innerHTML = "Successfully Deleted " + document.getElementById('deleteNumber').value + " items";
		document.getElementById('deleteData').style.backgroundColor = "#aaaaaa";
		document.getElementById('deleteData').disabled = true;
		setTimeout(() => {
			document.getElementById('deleteData').innerHTML = "Delete Items";
			document.getElementById('deleteData').style.backgroundColor = "#ff0000";
			document.getElementById('deleteData').disabled = false;
			document.getElementById('deleteNumber').value = 0;
		}, 2000);
	}
	xhr.send()
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('deleteData').addEventListener('click', deleteData);
document.getElementById('downloadData').addEventListener('click', downloadData);
document.getElementById('save').addEventListener('click', saveSettings);
document.getElementById('cancel').addEventListener('click', cancel);