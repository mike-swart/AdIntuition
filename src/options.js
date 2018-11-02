function saveSettings() {
	var shouldHaveBanner = document.getElementById('banner').checked;
	var shouldHighlightText = document.getElementById('text-highlight').checked;
	var shouldHighlightTitle = document.getElementById('title-highlight').checked;
	chrome.storage.sync.set({
		banner: shouldHaveBanner,
		textHighlighted: shouldHighlightText,
		titleHighlighted: shouldHighlightTitle
	}, function() {
		console.log('saved settings');
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    banner: true,
    textHighlighted: true,
    titleHighlighted: false
  }, function(items) {
    document.getElementById('banner').checked = items.banner;
    document.getElementById('text-highlight').checked = items.textHighlighted;
    document.getElementById('title-highlight').checked = items.titleHighlighted;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', saveSettings);