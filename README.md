# AdIntuition
A Browser Extension to detect and disclose affiliate marketing content.

For more information about the extension, feel free to consult our [Q&A](https://hci.princeton.edu/adintuition).

### Using the extension

#### Downloading
[Download for Google Chrome](https://chrome.google.com/webstore/detail/adintuition/pjpiddgaambjenhikcpbcbgjckidgpce)

[Download for FireFox](https://addons.mozilla.org/en-US/firefox/addon/adintuition/)

#### Developing on Chrome
* Go to `chrome://extensions`
* Toggle `developer mode` on in the upper right hand corner
* Click `Load Unpacked` and then select the `src` folder in this directory
* To package the extension into a .zip, run the `zip_src.sh` script

#### Developing for FireFox
* Checkout the `firefox` branch of this repo
* zip the source folder using the `zip_src.sh` script
* Navigate to `about:debugging` in the browser
* Click on the `Load Temporary Add-on...` button on the upper right side of the page
* select the zipped source folder

### Contents Layout

| Folder Name                    | Description                                                                |
| -----------------              | -----------                                                                |
| data/                          | Folder containing the training set for the clustering of videos            |
| src/						     | Folder containing the code that will run the extension                     |
| src/modules/               	 | Folder containing necessary libraries used by the Extension                |
| src/logos/                     | Folder containing any necessary logos                                      |
| server/                        | Folder containing code to check for url redirects and regex matches        |

### Licensing

AdIntuition uses an MIT License


