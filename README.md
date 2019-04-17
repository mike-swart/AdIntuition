# AdIntuition
A Browser Extension to flag affiliate marketing and hopefully sponsored content. This version represents the server version

### Using the extension
Steps to test the extension while it is still being developed:
* Go to `chrome://extensions`
* Toggle `developer mode` on in the upper right hand corner
* Click `Load Unpacked` and then select the `src` folder in this directory


### Research Question
How successfully can we show that there are advertisements on a social media platform? We will be focusing on YouTube, but the methods that we use will be possible to extend onto other platforms. What is the best way to display this data so that users can understand that the content creator is benefitting from the post?


### Progress Steps
(Note: Some steps can and should be worked on concurrently)
1. Create a Browser extension that can detect the affiliate marketing links that were discovered in the first study. 
	* Once this can detect these links, we must also look into how to best show the links. Possible options are a pop-up in the right hand corner or an annotation on the page that highlights the affiliated link.
	* Using the previous study, we can also comment that the affiliate marketing campaign has been disclosed

2. Extend the study into sponsored content
	
	Look at the video:
	* **Descriptions** Look for keywords such as "sponsored by", "advertisement", etc.
	* **Transcripts**
	* **Thumbnail**

	The likely set of steps will be to cluster based off of if there is a known disclosure by using the description. Then, using the descriptions cluster, we can extend to see if there are any trends in the transcripts that are present.

3. User Testing
	* Can test the browser extension to see if it can make it easier for a user to understand that there has been an affiliated marketing campaign and if it has been disclosed.

### Contents Layout

| Folder Name                    | Description                                                                |
| -----------------              | -----------                                                                |
| data/                          | Folder containing the training set for the clustering of videos            |
| src/data_reader/               | Folder containing the code to read the information in the ../data folder   |
| src/logos/                     | Folder containing any necessary logos                                      |
| src/server/                    | Folder containing code to check for url redirects and regex matches        |

| File Name                      | Description                                                                |
| -----------------              | -----------                                                                | 
| src/background.js              | Code that is run to determine when to try to edit the page                 |
| src/common.css                 | Constains all styles for the browser extension html elements               |
| src/getAndChangeBackground.js  | Code to edit the youtube page                                              |
| src/manifest.json              | Creates the correct formatting for the browser extension, with permissions, settings, and when files should be called |
| src/options.html               | Page html of the settings page                                             |
| src/options.js                 | Code to be called the options.html file. This makes the settings persistent|
| src/popup.html                 | The html of the dropdown that pops up when icon is clicked in the upper right hand corner |
| src/popup.js                   | Allows for the button to be clicked on popup.html                          |



