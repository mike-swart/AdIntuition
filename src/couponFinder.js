var CouponWeights = [-0.00004024931794063161, -0.00010751554319488044, -0.00004024931794063161, -0.00010013418298060461, 0.06317326467600226092, -0.00004849033516842100, -0.00016121731910465363, -0.00022428489804823953, -0.00414943683253530225, -0.00196938132587157330, -0.48280156293920778454, 0.06325285757728138503, 2.06319940055031603166, -0.00196938132587157330, 2.06303345003142091230, 1.85015223272053264125, 0.27713251413690170866, 0.06287894267645621760, 0.21305005355398237699, -0.00009745635220902041, -0.00004432204447751592, -0.00016121731910465363, -0.00522407494479172532, -1.00000000000000000000, -0.00004024931794063161, -1.00000000000000000000, -0.03137956739307986437, -0.00010013418298060461, 0.06315151856053347057, -0.33984266037397325988, 0.08067820323181328079, 0.06278289495700138667, -0.01044814988958345063, 0.06321178855180320522, -0.00009745635220902041, -0.00020384265051222222, -0.09711063275968855046, -0.08965651952528118362, -0.00004432204447751592, -0.00004024931794063161, -0.00986614921021462116, -0.01764809886606554315, -0.00004432204447751592, -0.00789676788434304743, 0.06327300884958853011, -0.09711063275968855046, -0.00004702572664523619, -0.00937351177732702670, -0.01567222483437517508, -0.00009745635220902041, -0.07146004546262424428, -0.00004432204447751592, -0.11661325605548721052, -0.03137956739307986437, -0.00522407494479172532, 0.06329927934533863265, -0.09711063275968855046, -0.46267455828353232228, -0.00009745635220902041, 0.45138112019019904775, -0.46267455828353232228, -0.45150824705011238791, 0.06291308866960682034, -0.00196938132587157330, -0.00004024931794063161, -0.00522407494479172532, -0.00004024931794063161, -0.07146004546262424428, -0.00009698067033684201, -0.00009745635220902041, -1.00000000000000000000, 0.00026463554294342551, -1.00000000000000000000, 0.02695673653020602342, -0.00522407494479172532, -0.46267455828353232228, -0.00414943683253530225, 0.20633509751246847941, -0.00004432204447751592, -0.46267455828353232228, -0.09711063275968855046, -0.00196938132587157330];
var CouponFeatures = ["access","also","audio","auto","available","best","bmw","call","case","channel","cheap","check","checkout","click","code","codes","coupon","day","discount","download","easy","exclusive","experience","fair","features","fifa","food","ford","free","game","get","go","great","help","high","honda","house","join","learn","like","live","making","many","media","microsoft","mix","music","new","nissan","official","old","phone","player","pop","price","psn","radio","read","release","save","show","site","store","subscribe","system","team","touch","toys","traffic","tv","us","use","used","using","vehicle","video","wa","want","way","without","world","youtube"];
var featuresDict = {}
for(var i = 0; i < CouponFeatures.length; i++) {
    featuresDict[CouponFeatures[i]] = i;
}

chrome.runtime.sendMessage({"function": "getCouponFeaturesAndWeights"}, function(response) {
    CouponWeights = response.weights;
    CouponFeatures = response.features;
    featuresDict = {};
    for(var i = 0; i < CouponFeatures.length; i++) {
        featuresDict[CouponFeatures[i]] = i;
    }
});

const stopwords = ["i", "me", "my", "myself" , "we" , "our" , "ours" , "ourselves" , "you" , "you're" , "you've" , "you'll" , "you'd" , "your" , "yours" , "yourself" , "yourselves" , "he" , "him" , "his" , "himself" , "she" , "she's" , "her" , "hers" , "herself" , "it" , "it's" , "its" , "itself" , "they" , "them" , "their" , "theirs" , "themselves" , "what" , "which" , "who" , "whom" , "this" , "that" , "that'll" , "these" , "those" , "am" , "is" , "are" , "was" , "were" , "be" , "been" , "being" , "have" , "has" , "had" , "having" , "do" , "does" , "did" , "doing" , "a" , "an" , "the" , "and" , "but" , "if" , "or" , "because" , "as" , "until" , "while" , "of" , "at" , "by" , "for" , "with" , "about" , "against" , "between" , "into" , "through" , "during" , "before" , "after" , "above" , "below" , "to" , "from" , "up" , "down" , "in" , "out" , "on" , "off" , "over" , "under" , "again" , "further" , "then" , "once" , "here" , "there" , "when" , "where" , "why" , "how" , "all" , "any" , "both" , "each" , "few" , "more" , "most" , "other" , "some" , "such" , "no" , "nor" , "not" , "only" , "own" , "same" , "so" , "than" , "too" , "very" , "s" , "t" , "can" , "will" , "just" , "don" , "don't" , "should" , "should've" , "now" , "d" , "ll" , "m" , "o" , "re" , "ve" , "y" , "ain" , "aren" , "aren't" , "couldn" , "couldn't" , "didn" , "didn't" , "doesn" , "doesn't" , "hadn" , "hadn't" , "hasn" , "hasn't" , "haven" , "haven't" , "isn" , "isn't" , "ma" , "mightn" , "mightn't" , "mustn" , "mustn't" , "needn" , "needn't" , "shan" , "shan't" , "shouldn" , "shouldn't" , "wasn" , "wasn't" , "weren" , "weren't" , "won" , "won't" , "wouldn" , "wouldn't"];

function tokenize(sentence) {
    //get rid of unreadable text
    sentence = sentence.replace(/[^\x20-\x7E]/g, '');
    //make it lowercase
    sentence = sentence.toLowerCase();
    //get rid of links
    sentence = sentence.replace(/(http[s]?:\/\/|www.)(?:[a-zA-Z]|[0-9]|[$-_@.&+]*|[!*\\\\(\\\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))*/g, '');
    //get rid of digits
    sentence = sentence.replace(/[0-9]/g, '');
    //just save words
    var RegexpTokenizer = new RegExp(/([a-zA-Z]*'[a-zA-Z]*)|(\w+)/i);
    var tokens = [];
    var matchObj = RegexpTokenizer.exec(sentence);
    while (matchObj) {
        var matchString = matchObj[0];
        tokens.push(matchString);
        sentence = sentence.substring(matchObj.index + matchString.length+1);
        matchObj = RegexpTokenizer.exec(sentence);
    }
    var newTokens = [];
    //get rid of stopwords
    for (var i = 0; i < tokens.length; i++) {
        if (stopwords.indexOf(tokens[i]) < 0) {
            newTokens.push(tokens[i]);
        }
    }
    tokens = newTokens;
    return tokens
}

function get_vector(str) {
    var vector = [];
    for(var i = 0; i < CouponFeatures.length; i++) {
        vector.push(0);
    }
    var split = tokenize(str);
    for(var i = 0; i < split.length; i++) {
        if (split[i].toLowerCase() in featuresDict) {
            vector[featuresDict[split[i].toLowerCase()]] += 1
        }
    }
    return vector;
}

function get_prediction(sentence){
	var vector = get_vector(sentence);
	sum = 0
	for (var i = 0; i < vector.length; i++) {
		sum += vector[i] * CouponWeights[i]
	}
	return sum
}
