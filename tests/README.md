# Testing the Extension
* `pip install selenium`
* Download the chrome version that your browser currently runs from [here](https://sites.google.com/a/chromium.org/chromedriver/downloads) and add it to your /usr/local/bin folder
* Create a version of the extension that does not log data to the server
* Obtain a .crx version of the extension. This can be done with the `Pack Extension` button of the `chrome://extensions` page when it is in developer mode. It should be called `src.crx` and placed in the `testing` folder.
* Run `python test.py`
* Note: Might have to run more than once because of download bug where it does not work the first time
