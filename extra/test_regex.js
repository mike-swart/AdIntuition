strings = [
	"ad.admitad.com/g/", "ad.admitad.com/f/", 
	"ad.admitad.com/goto/", "ad.admitad.com/gota/",
	"performance.affiliaxe.com/abcde?aff_id=", "performance.affiliaxe.com/abcdeaff_id=",
	"performance.affiliaxe.com/abcde&aff_id=", "performance.affiliaxe.com/abcdeaff_id=",
	"s.aliexpress.com/abcde?af=", "s.aliexpress.com/abcdeaf=",
	"s.aliexpress.com/abcde&af=", "s.aliexpress.com/abcdeaf=",
	"amazon.com/abcde?tag=", "amazon.com/abcdetag=",
	"amazon.com/abcde&tag=", "amazon.com/abcdetag=",
	"amazon.de/abcde?tag=", "amazon.de/abcdetag=",
	"amazon.de/abcde&tag=", "amazon.de/abcdetag=",
	"amazon.it/abcde?tag=", "amazon.it/abcdetag=",
	"amazon.it/abcde&tag=", "amazon.it/abcdetag=",
	"amazon.in/abcde?tag=", "amazon.in/abcdetag=",
	"amazon.in/abcde&tag=", "amazon.in/abcdetag=",
	"amazon.fr/abcde?tag=", "amazon.fr/abcdetag=",
	"amazon.fr/abcde&tag=", "amazon.fr/abcdetag=",
	"primevideo.com/abcde?ref=", "primevideo.com/abcderef=",
	"primevideo.com/abcde&ref=", "primevideo.com/abcderef=",
	"affiliates.audiobooks.com/abcde?a_aid=abcde&a_bid=", "affiliates.audiobooks.com/abcdea_aid=abcdea_bid=", 
	"affiliates.audiobooks.com/abcde?a_bid=abcde&a_aid=", "affiliates.audiobooks.com/abcdea_bid=abcde&a_aid=",
	"affiliates.audiobooks.com/abcde&a_bid=abcde&a_aid=", "affiliates.audiobooks.com/abcde&a_bid=abcdea_aid="
];
console.log("testing");
for (var i=0; i<strings.length; i++) {
	if (((i % 2) === 0) && !urlMatches(strings[i])) {console.log("should be true but is not:\t" + strings[i])}
	if (((i % 2) === 1) && urlMatches(strings[i])) {console.log("should be false but is not:\t" + strings[i])}
}

function urlMatches(url) {
	//const str = "(ad.admitad.com/g/)|(ad.admitad.com/goto/)|(performance.affiliaxe.com/*?aff_id=)|(performance.affiliaxe.com/*&aff_id=)|(s.aliexpress.com/*?af=)|(s.aliexpress.com/*&af=)|(amazon.com/*?tag=)|(amazon.com/*&tag=)|(amazon.de/*?tag=)|(amazon.de/*&tag=)|(amazon.it/*?tag=)|(amazon.it/*&tag=)|(amazon.in/*?tag=)|(amazon.in/*&tag=)|(amazon.fr/*?tag=)|(amazon.fr/*&tag=)|(primevideo.com/*?ref=)|(primevideo.com/*&ref=)|(itunes.apple.com/*?at=)|(itunes.apple.com/*&at=)|(apple.com/*?afid=)|(apple.com/*&afid=)|(affiliates.audiobooks.com/*?a_aid=*&a_bid=)|(affiliates.audiobooks.com/*?a_bid=*&a_aid=)|(affiliates.audiobooks.com/*&a_bid=*&a_aid=)|(avantlink.com/*?pw=)|(avantlink.com/*&pw=)|(secure.avangate.com/*?affiliate=)|(secure.avangate.com/*&affiliate=)|(awin1.com/*?awinaffid=)|(awin1.com/*&awinaffid=)|(ad.zanox.com/ppc^)|(zenaps.com/rclick.php?)|(banggood.com/*?p=)|(banggood.com/*&p=)|(bookdepository.com/*?a_aid=)|(bookdepository.com/*&a_aid=)|(booking.com/*?aid=)|(booking.com/*&aid=)|(hop.clickbank.net^)|(anrdoezrs.net/click-)|(cj.dotomi.com^)|(dpbolvw.net/click-)|(emjcd.com^)|(jdoqocy.com/click-)|(kqzyfj.com/click-)|(qksrv.net^)|(tkqlhce.com/click-)|(designmodo.com/?u=)|(rover.ebay.com/*?campid=)|(rover.ebay.com/*&campid=)|(audiojungle.net/*?ref=)|(audiojungle.net/*&ref=)|(codecanyon.net/*?ref=)|(codecanyon.net/*&ref=)|(marketplace.envato.com/*?ref=)|(marketplace.envato.com/*&ref=)|(graphicriver.net/*?ref=)|(graphicriver.net/*&ref=)|(themeforest.net/*?ref=)|(themeforest.net/*&ref=)|(videohive.net/*?ref=)|(videohive.net/*&ref=)|(buyeasy.by/cashback/)|(buyeasy.by/redirect/)|(flipkart.com/*?affid=)|(flipkart.com/*&affid=)|(gtomegaracing.com/*?tracking=)|(gtomegaracing.com/*&tracking=)|(search.hotellook.com/*?marker=)|(search.hotellook.com/*&marker=)|(hotmart.net.br/*?a=)|(hotmart.net.br/*&a=)|(7eer.net/c/)|(evyy.net/c/)|(kontrolfreek.com/*?a_aid=)|(kontrolfreek.com/*&a_aid=)|(online.ladbrokes.com/promoRedirect?key=)|(online.ladbrokes.com/promoRedirect\\?*&key=)|(makeupgeek.com/*?acc=)|(makeupgeek.com/*&acc=)|(gopjn.com/t/)|(pjatr.com/t/)|(pjtra.com/t/)|(pntra.com/t/)|(pntrac.com/t/)|(pntrs.com/t/)|(click.linksynergy.com/*?id=)|(click.linksynergy.com/*&id=)|(go.redirectingat.com/*?id=)|(go.redirectingat.com/*&id=)|(olymptrade.com/*?affiliate_id=)|(olymptrade.com/*&affiliate_id=)|(rstyle.me^)|(shopstyle.it^)|(shareasale.com/r.cfm^)|(shareasale.com/m-pr.cfm^)|(shareasale.com/u.cfm^)|(apessay.com/*?rid=)|(apessay.com/*&rid=)|(tatacliq.com/*?cid=af:)|(tatacliq.com/*&cid=af:)|(thermoworks.com/*?tw=)|(thermoworks.com/*&tw=)|(zaful.com/*?lkid=)|(zaful.com/*&lkid=)";
	const str = "(ad.admitad.com/g/)|(ad.admitad.com/goto/)|(performance.affiliaxe.com/.*\\?aff_id=)|(performance.affiliaxe.com/.*&aff_id=)|(s.aliexpress.com/.*\\?af=)|(s.aliexpress.com/.*&af=)|(amazon.com/.*\\?tag=)|(amazon.com/.*&tag=)|(amazon.de/.*\\?tag=)|(amazon.de/.*&tag=)|(amazon.it/.*\\?tag=)|(amazon.it/.*&tag=)|(amazon.in/.*\\?tag=)|(amazon.in/.*&tag=)|(amazon.fr/.*\\?tag=)|(amazon.fr/.*&tag=)|(primevideo.com/.*\\?ref=)|(primevideo.com/.*&ref=)|(itunes.apple.com/.*\\?at=)|(itunes.apple.com/.*&at=)|(apple.com/.*\\?afid=)|(apple.com/.*&afid=)|(affiliates.audiobooks.com/.*\\?a_aid=.*&a_bid=)|(affiliates.audiobooks.com/.*\\?a_bid=.*&a_aid=)|(affiliates.audiobooks.com/.*&a_bid=.*&a_aid=)|(avantlink.com/.*\\?pw=)|(avantlink.com/.*&pw=)|(secure.avangate.com/.*\\?affiliate=)|(secure.avangate.com/.*&affiliate=)|(awin1.com/.*\\?awinaffid=)|(awin1.com/.*&awinaffid=)|(ad.zanox.com/ppc^)|(zenaps.com/rclick.php\\?)|(banggood.com/.*\\?p=)|(banggood.com/.*&p=)|(bookdepository.com/.*\\?a_aid=)|(bookdepository.com/.*&a_aid=)|(booking.com/.*\\?aid=)|(booking.com/.*&aid=)|(hop.clickbank.net^)|(anrdoezrs.net/click-)|(cj.dotomi.com^)|(dpbolvw.net/click-)|(emjcd.com^)|(jdoqocy.com/click-)|(kqzyfj.com/click-)|(qksrv.net^)|(tkqlhce.com/click-)|(designmodo.com/\\?u=)|(rover.ebay.com/.*\\?campid=)|(rover.ebay.com/.*&campid=)|(audiojungle.net/.*\\?ref=)|(audiojungle.net/.*&ref=)|(codecanyon.net/.*\\?ref=)|(codecanyon.net/.*&ref=)|(marketplace.envato.com/.*\\?ref=)|(marketplace.envato.com/.*&ref=)|(graphicriver.net/.*\\?ref=)|(graphicriver.net/.*&ref=)|(themeforest.net/.*\\?ref=)|(themeforest.net/.*&ref=)|(videohive.net/.*\\?ref=)|(videohive.net/.*&ref=)|(buyeasy.by/cashback/)|(buyeasy.by/redirect/)|(flipkart.com/.*\\?affid=)|(flipkart.com/.*&affid=)|(gtomegaracing.com/.*\\?tracking=)|(gtomegaracing.com/.*&tracking=)|(search.hotellook.com/.*\\?marker=)|(search.hotellook.com/.*&marker=)|(hotmart.net.br/.*\\?a=)|(hotmart.net.br/.*&a=)|(7eer.net/c/)|(evyy.net/c/)|(kontrolfreek.com/.*\\?a_aid=)|(kontrolfreek.com/.*&a_aid=)|(online.ladbrokes.com/promoRedirect\\?key=)|(online.ladbrokes.com/promoRedirect\\?.*&key=)|(makeupgeek.com/.*\\?acc=)|(makeupgeek.com/.*&acc=)|(gopjn.com/t/)|(pjatr.com/t/)|(pjtra.com/t/)|(pntra.com/t/)|(pntrac.com/t/)|(pntrs.com/t/)|(click.linksynergy.com/.*\\?id=)|(click.linksynergy.com/.*&id=)|(go.redirectingat.com/.*\\?id=)|(go.redirectingat.com/.*&id=)|(olymptrade.com/.*\\?affiliate_id=)|(olymptrade.com/.*&affiliate_id=)|(rstyle.me^)|(shopstyle.it^)|(shareasale.com/r.cfm^)|(shareasale.com/m-pr.cfm^)|(shareasale.com/u.cfm^)|(apessay.com/.*\\?rid=)|(apessay.com/.*&rid=)|(tatacliq.com/.*\\?cid=af:)|(tatacliq.com/.*&cid=af:)|(thermoworks.com/.*\\?tw=)|(thermoworks.com/.*&tw=)|(zaful.com/.*\\?lkid=)|(zaful.com/.*&lkid=)";
	//const searchPattern = new RegExp("(amazon.com/.*\\?tag=)");
	const searchPattern = new RegExp(str);
	//console.log(searchPattern);
	// patterns = str.split("|")
	// for (var i=0; i<patterns.length; i++) {
	// 	console.log(patterns[i]);
	// 	const searchPattern = new RegExp(patterns[i]);
	// 	searchPattern.exec(url) !== null
	// }
	return searchPattern.test(url)
}
