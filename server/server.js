var port = 4567;

const express = require('express')  
const JSEncrypt = require('./node_modules/node-jsencrypt/index.js');
const CryptoJS = require('./node_modules/crypto-js/crypto-js.js')

const app = express()

function allowCrossDomain(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,POST')
	res.header('Access-Control-Allow-Headers', 'Content-Type')
	next()
}

//these are on an aws lambda instance now
function urlMatches(url) {
	//check in the ../extra directory to see how we got this string
	const str = "(ad.admitad.com/g/)|(ad.admitad.com/goto/)|(performance.affiliaxe.com/.*\\?aff_id=)|(performance.affiliaxe.com/.*&aff_id=)|(s.aliexpress.com/.*\\?af=)|(s.aliexpress.com/.*&af=)|(amazon.com/.*\\?tag=)|(amazon.com/.*&tag=)|(amazon.de/.*\\?tag=)|(amazon.de/.*&tag=)|(amazon.it/.*\\?tag=)|(amazon.it/.*&tag=)|(amazon.in/.*\\?tag=)|(amazon.in/.*&tag=)|(amazon.fr/.*\\?tag=)|(amazon.fr/.*&tag=)|(primevideo.com/.*\\?ref=)|(primevideo.com/.*&ref=)|(itunes.apple.com/.*\\?at=)|(itunes.apple.com/.*&at=)|(apple.com/.*\\?afid=)|(apple.com/.*&afid=)|(affiliates.audiobooks.com/.*\\?a_aid=.*&a_bid=)|(affiliates.audiobooks.com/.*\\?a_bid=.*&a_aid=)|(affiliates.audiobooks.com/.*&a_bid=.*&a_aid=)|(avantlink.com/.*\\?pw=)|(avantlink.com/.*&pw=)|(secure.avangate.com/.*\\?affiliate=)|(secure.avangate.com/.*&affiliate=)|(awin1.com/.*\\?awinaffid=)|(awin1.com/.*&awinaffid=)|(ad.zanox.com/ppc^)|(zenaps.com/rclick.php\\?)|(banggood.com/.*\\?p=)|(banggood.com/.*&p=)|(bookdepository.com/.*\\?a_aid=)|(bookdepository.com/.*&a_aid=)|(booking.com/.*\\?aid=)|(booking.com/.*&aid=)|(hop.clickbank.net^)|(anrdoezrs.net/click-)|(cj.dotomi.com^)|(dpbolvw.net/click-)|(emjcd.com^)|(jdoqocy.com/click-)|(kqzyfj.com/click-)|(qksrv.net^)|(tkqlhce.com/click-)|(designmodo.com/\\?u=)|(rover.ebay.com/.*\\?campid=)|(rover.ebay.com/.*&campid=)|(audiojungle.net/.*\\?ref=)|(audiojungle.net/.*&ref=)|(codecanyon.net/.*\\?ref=)|(codecanyon.net/.*&ref=)|(marketplace.envato.com/.*\\?ref=)|(marketplace.envato.com/.*&ref=)|(graphicriver.net/.*\\?ref=)|(graphicriver.net/.*&ref=)|(themeforest.net/.*\\?ref=)|(themeforest.net/.*&ref=)|(videohive.net/.*\\?ref=)|(videohive.net/.*&ref=)|(buyeasy.by/cashback/)|(buyeasy.by/redirect/)|(flipkart.com/.*\\?affid=)|(flipkart.com/.*&affid=)|(gtomegaracing.com/.*\\?tracking=)|(gtomegaracing.com/.*&tracking=)|(search.hotellook.com/.*\\?marker=)|(search.hotellook.com/.*&marker=)|(hotmart.net.br/.*\\?a=)|(hotmart.net.br/.*&a=)|(7eer.net/c/)|(evyy.net/c/)|(kontrolfreek.com/.*\\?a_aid=)|(kontrolfreek.com/.*&a_aid=)|(online.ladbrokes.com/promoRedirect\\?key=)|(online.ladbrokes.com/promoRedirect\\?.*&key=)|(makeupgeek.com/.*\\?acc=)|(makeupgeek.com/.*&acc=)|(gopjn.com/t/)|(pjatr.com/t/)|(pjtra.com/t/)|(pntra.com/t/)|(pntrac.com/t/)|(pntrs.com/t/)|(click.linksynergy.com/.*\\?id=)|(click.linksynergy.com/.*&id=)|(go.redirectingat.com/.*\\?id=)|(go.redirectingat.com/.*&id=)|(olymptrade.com/.*\\?affiliate_id=)|(olymptrade.com/.*&affiliate_id=)|(rstyle.me^)|(shopstyle.it^)|(shareasale.com/r.cfm^)|(shareasale.com/m-pr.cfm^)|(shareasale.com/u.cfm^)|(apessay.com/.*\\?rid=)|(apessay.com/.*&rid=)|(tatacliq.com/.*\\?cid=af:)|(tatacliq.com/.*&cid=af:)|(thermoworks.com/.*\\?tw=)|(thermoworks.com/.*&tw=)|(zaful.com/.*\\?lkid=)|(zaful.com/.*&lkid=)";
	var searchPattern = new RegExp(str);
	return searchPattern.test(url);
}

function checkRedirectsAndMatches(url) {
	var matches = urlMatches(url);
	if (matches) {
		return 200, true;
	}
	const { spawnSync } = require( 'child_process' )
	const response = spawnSync( 'curl', [ '-I','-H','Accept: application/json','-H', 'Content-Type: application/json', '-X', 'GET', url], {shell: true});
	var output = response.stdout.toString();
	//check for a redirect
	lines = output.split(/[\r\n,\r,\n]+/);
	//the first line will have the response code after the first white space
	var responseCode = parseInt(lines[0].split(/[\s]+/)[1]);
	if (responseCode >= 300 && responseCode < 400) {
		for (var i=1; i<lines.length;i++) {
			if (lines[i].indexOf("Location") === 0 || lines[i].indexOf("location") === 0) {
				var newUrl = lines[i].split(/[\s]+/)[1];
				console.log(newUrl);
				return checkRedirectsAndMatches(newUrl);
			}
		}
	}
	return 200, false;
}

function getUrlFromEncodings(encodings) {
	var decrypt = new JSEncrypt();
	decrypt.setPrivateKey("MIICXQIBAAKBgQDgtuUTP8432z2+e80YoTZaeW8i/0PmocUAXIRuXst2Qp/13c1xWTmkGUhuuCxoh6U0mCzAR5NZUORcEQMlMO18Eh4IBElyvgWu6kKZfK7ypWc+5mrtzpRz49MdUZx5vXkeclFrPUKswAN8ZNONt1VXVWyKeq5lbWmYirOvxu6DuQIDAQABAoGAT5p6q8b+lmrkBIZ2sTLqvkImTI+AzkKgNvCPOUn7aXlQkRhxnqWs9aS/M/mqQZ1LuMXvlG3GlO1C+BpOsu4SMid+539/df/ER5ANaJPVBw0HBCxQRQJcirVRHWrjV691NuGkuIZ7ZKeZT8tj4LJaAcetA09Au5yL4vL2ZvZ1X8ECQQD1cqVdUWv8mtPnf3fUohuGjAPCgjO8zCAyKH7Q+ADp9i8Sdo3dU6LskkBQ6S5oBf7c3LiJYBvPcd7VTcr+iIDPAkEA6mAPkj/zAP7MrBSMB7OfhbyE2e+X0CIpgbk7kb9v+U06/L/vbGrE/DhXubgiBRdfKB99TB9p7wr2PJ3jlRkE9wJBAJj0AKjOfITF1xeED6CqBI0r44vqp2MXsViQc7a1VZx2lY7j4jPyUq0p1nqVVR3t3oyz3yt8gNgdFcfG2qETX3ECQQDCBHtfaijTrhnoaanxxjRMFV80ui5GUcFibeBuKrea/N/T019ztH8U+99DEra22D4hjM/AcFDVXZGxZFK9XlTJAkA3hTNJuSEJeKqaw05MG5dQWk3/PH+iDhoczPUtQTHxCHwLp7DMWBJdh+5XBkHsWZ513R185ER7X0SOr47HqMhT");
	var uncrypted = decrypt.decrypt(encodings["key"]);

	var decKeyStr = uncrypted.substring(0, uncrypted.indexOf("|"));
	var decIVStr = uncrypted.substring(uncrypted.indexOf("|")+1);

	var decKey = CryptoJS.enc.Hex.parse(decKeyStr);
	var decIV = CryptoJS.enc.Hex.parse(decIVStr);
	var decrypted = CryptoJS.AES.decrypt(encodings["data"], decKey, {mode: CryptoJS.mode.CTR, iv: decIV});
	var finalString = decrypted.toString(CryptoJS.enc.Utf8);
	return finalString;
}

app.use(allowCrossDomain)
app.use('/', (request, response) => {
	//expect to be of the form localhost:4567/?url=<insert_url_here>
	query = request.query;
	if (query.data && query.key) {
		console.log(getUrlFromEncodings(query));
		// console.log(typeof(query));
		response.send(200, true);
		// var redirectExists = checkRedirectsAndMatches(query.url);
		// response.send(redirectExists);
	}
})
app.listen(port, (err) => {  
	if (err) {
		return console.log('something bad happened', err)
	}
	console.log(`server is listening on ${port}`)
})