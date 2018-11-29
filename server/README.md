# Server
A server is needed to inspec urls for matches because http addresses are not safely reachable from https websites, such as YouTube. This directory contains the necessary files to run that server.

### Contents

| File Name                      | Description                                                                |
| -----------------              | -----------                                                                | 
| server.js                      | This code is used to run the server locally (on host 4567). A very similar version exists on the aws Lambda instance |
| inspect_url.js                 | This code can be run on the command line using the form `node inspect_url.js [url_address]`. It will show all redirects and if there is a match for the regular expression|


### Running the server locally
In this directory

`node server.js`
`ngrok http 4567`
Then, you must use the https forwarding link in the getAndChangeBackground.js SERVER_ADDRESS variable
