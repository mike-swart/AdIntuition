
//these are on an aws lambda instance now
function urlMatches(url) {
	//check in the ../extra directory to see how we got this string
	const str = "(ad.admitad.com/g/)|(ad.admitad.com/goto/)|(performance.affiliaxe.com/.*\\?aff_id=)|(performance.affiliaxe.com/.*&aff_id=)|(s.aliexpress.com/.*\\?af=)|(s.aliexpress.com/.*&af=)|(amazon.com/.*\\?tag=)|(amazon.com/.*&tag=)|(amazon.de/.*\\?tag=)|(amazon.de/.*&tag=)|(amazon.it/.*\\?tag=)|(amazon.it/.*&tag=)|(amazon.in/.*\\?tag=)|(amazon.in/.*&tag=)|(amazon.fr/.*\\?tag=)|(amazon.fr/.*&tag=)|(primevideo.com/.*\\?ref=)|(primevideo.com/.*&ref=)|(itunes.apple.com/.*\\?at=)|(itunes.apple.com/.*&at=)|(apple.com/.*\\?afid=)|(apple.com/.*&afid=)|(affiliates.audiobooks.com/.*\\?a_aid=.*&a_bid=)|(affiliates.audiobooks.com/.*\\?a_bid=.*&a_aid=)|(affiliates.audiobooks.com/.*&a_bid=.*&a_aid=)|(avantlink.com/.*\\?pw=)|(avantlink.com/.*&pw=)|(secure.avangate.com/.*\\?affiliate=)|(secure.avangate.com/.*&affiliate=)|(awin1.com/.*\\?awinaffid=)|(awin1.com/.*&awinaffid=)|(ad.zanox.com/ppc^)|(zenaps.com/rclick.php\\?)|(banggood.com/.*\\?p=)|(banggood.com/.*&p=)|(bookdepository.com/.*\\?a_aid=)|(bookdepository.com/.*&a_aid=)|(booking.com/.*\\?aid=)|(booking.com/.*&aid=)|(hop.clickbank.net^)|(anrdoezrs.net/click-)|(cj.dotomi.com^)|(dpbolvw.net/click-)|(emjcd.com^)|(jdoqocy.com/click-)|(kqzyfj.com/click-)|(qksrv.net^)|(tkqlhce.com/click-)|(designmodo.com/\\?u=)|(rover.ebay.com/.*\\?campid=)|(rover.ebay.com/.*&campid=)|(audiojungle.net/.*\\?ref=)|(audiojungle.net/.*&ref=)|(codecanyon.net/.*\\?ref=)|(codecanyon.net/.*&ref=)|(marketplace.envato.com/.*\\?ref=)|(marketplace.envato.com/.*&ref=)|(graphicriver.net/.*\\?ref=)|(graphicriver.net/.*&ref=)|(themeforest.net/.*\\?ref=)|(themeforest.net/.*&ref=)|(videohive.net/.*\\?ref=)|(videohive.net/.*&ref=)|(buyeasy.by/cashback/)|(buyeasy.by/redirect/)|(flipkart.com/.*\\?affid=)|(flipkart.com/.*&affid=)|(gtomegaracing.com/.*\\?tracking=)|(gtomegaracing.com/.*&tracking=)|(search.hotellook.com/.*\\?marker=)|(search.hotellook.com/.*&marker=)|(hotmart.net.br/.*\\?a=)|(hotmart.net.br/.*&a=)|(7eer.net/c/)|(evyy.net/c/)|(kontrolfreek.com/.*\\?a_aid=)|(kontrolfreek.com/.*&a_aid=)|(online.ladbrokes.com/promoRedirect\\?key=)|(online.ladbrokes.com/promoRedirect\\?.*&key=)|(makeupgeek.com/.*\\?acc=)|(makeupgeek.com/.*&acc=)|(gopjn.com/t/)|(pjatr.com/t/)|(pjtra.com/t/)|(pntra.com/t/)|(pntrac.com/t/)|(pntrs.com/t/)|(click.linksynergy.com/.*\\?id=)|(click.linksynergy.com/.*&id=)|(go.redirectingat.com/.*\\?id=)|(go.redirectingat.com/.*&id=)|(olymptrade.com/.*\\?affiliate_id=)|(olymptrade.com/.*&affiliate_id=)|(rstyle.me^)|(shopstyle.it^)|(shareasale.com/r.cfm^)|(shareasale.com/m-pr.cfm^)|(shareasale.com/u.cfm^)|(apessay.com/.*\\?rid=)|(apessay.com/.*&rid=)|(tatacliq.com/.*\\?cid=af:)|(tatacliq.com/.*&cid=af:)|(thermoworks.com/.*\\?tw=)|(thermoworks.com/.*&tw=)|(zaful.com/.*\\?lkid=)|(zaful.com/.*&lkid=)";
	var searchPattern = new RegExp(str);
	return searchPattern.test(url);
}

//these are on an aws lambda instance now
function urlUtmMatches(url) {
	//check in the ../extra directory to see how we got this string
	//"There is a business relationship between the content creator"
	const str = "((utm_source=.*)|(utm_term=.*)|(utm_campaign=.*)|(utm_content=.*)|(utm_medium=.*)|(aff_id=.*)|(campaignid=.*)){1}"
	var searchPattern = new RegExp(str);
	return searchPattern.test(url);
}

function checkRedirectsAndMatches(prevUrl, newUrl, depth=0) {
	var url = newUrl;
	if (url.substring(0,1) == "/") {
		if (prevUrl === "") {
			//this is the first time
			return retVal
		} 
		var searchPattern = new RegExp("http[s]?:\/\/[^\/\s]*\.[^\/\s]*\.[^\/\s][^\/\s][^\/\s]?\/");
		var temp = prevUrl.split(searchPattern);
		if (!temp) {
			url = prevUrl + newUrl;
		}
		else if (temp.length === 1) {
			url = prevUrl.substring(0, prevUrl.length-1) + newUrl;
		}
		else {
			url = prevUrl.substring(0, prevUrl.length-temp[1].length-1) + newUrl;
		}
	}
	var matches = urlMatches(url);
	var utmmatches = urlUtmMatches(url);
	const { spawnSync } = require( 'child_process' )
	const response = spawnSync( 'curl', [ '-I','-H','Accept: application/json','-H', 'Content-Type: application/json', '-X', 'GET', url], {shell: true});
	var output = response.stdout.toString();
	//check for a redirect
	lines = output.split(/[\r\n,\r,\n]+/);
	//the first line will have the response code after the first white space
	var responseCode = parseInt(lines[0].split(/[\s]+/)[1]);
	console.log(depth + " Code: " + responseCode + "\t\tmatch: " + matches + " " + utmmatches + "\t\turl: " + url);
	if (responseCode >= 300 && responseCode < 400) {
		for (var i=1; i<lines.length;i++) {
			if (lines[i].indexOf("Location") === 0 || lines[i].indexOf("location") === 0) {
				var newUrl = lines[i].split(/[\s]+/)[1];
				checkRedirectsAndMatches(url, newUrl, depth+1);
			}
		}
	}
}

var url = process.argv[2];
checkRedirectsAndMatches("", url);

//curl -I -H "Accept: application/json" -H "Content-Type: application/json" -X GET <url>