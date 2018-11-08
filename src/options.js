function saveSettings() {
	var shouldHaveBanner = document.getElementById('banner').checked;
	var shouldHighlightText = document.getElementById('text-highlight').checked;
	var shouldHighlightTitle = document.getElementById('title-highlight').checked;
	var shouldHaveSound = document.getElementById('sound-played').checked;
	var desktopNotif = document.getElementById('desktop-notification').checked;
	if (!shouldHaveBanner && !shouldHighlightText && !shouldHighlightTitle && !shouldHaveSound && !desktopNotif) {
		alert("Please select at least one option");
		return
	}
	chrome.storage.sync.set({
		banner: shouldHaveBanner,
		textHighlighted: shouldHighlightText,
		titleHighlighted: shouldHighlightTitle,
		sound: shouldHaveSound,
		desktopNotification: desktopNotif
	}, function() {
		console.log('saved settings');
	});
	window.close();
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		banner: true,
		textHighlighted: true,
		titleHighlighted: false,
		sound: false,
		desktopNotification: false,
	}, function(items) {
		document.getElementById('banner').checked = items.banner;
		document.getElementById('text-highlight').checked = items.textHighlighted;
		document.getElementById('title-highlight').checked = items.titleHighlighted;
		document.getElementById('sound-played').checked = items.sound;
		document.getElementById('desktop-notification').checked = items.desktopNotification;
	});
}

function playSound() {
	chrome.runtime.sendMessage({"function": "play_sound"});
}

function cancel() {
	window.close();
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('hear-sound').addEventListener('click', playSound);
document.getElementById('save').addEventListener('click', saveSettings);
document.getElementById('cancel').addEventListener('click', cancel);