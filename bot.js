var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);
var stream = Twitter.stream('statuses/filter',{ track: 'palindrome','palindrometer'; language: 'en' });

stream.on('tweet', function (tweet) {
    var filtered = filterJunk(tweet.text);
    if(filtered){
        console.log("filtered tweet")
    }else{
        palindrometer(tweet.text,tweet.id_str);
    }
});

//todo filter explicit tweets, add db so no repeats.

function palindrometer(x,y){
    var tweetId = y;
    /////////////////////////////////////////////////////////////////////////
    function fS(element){ //fS, or 'find symmetry'
        var minLength = 9; //minimum character length of palindrome,
        // excluding spaces and punctuation, which will have been scrubbed already.
        var x = element;
        if(x.length<minLength){
            return false
        }

        if(x.indexOf()){
            return false
        }
        var counter = 0;
        //console.log("y = " + y);
        var z = x.length;
        //console.log("z  = " + z);
        for(i=0;i<=x.length/2;i++){
            z--;
            if(x[i] == x[z]){
                //console.log("x[i] | x[z] = " + x[i] + " | " + x[z]);
                counter++;
            }else{
                return false
            }
        }
        console.log("Found a palindrome! It is: " + element + ". It is " + element.length + " characters long. Nice!");
        Twitter.post('statuses/retweet/:id', { id: tweetId }, function (err, data, response) {
            console.log(data)
        })
    }
    //////////////////////////////////////////////////////////////////////////
    function filterCommon(x){
        var y = "segment: " + x;
        var commons = [ //includes some common palindromes to avoid repeats, adding DB later...
            "lollollol", ".........","nevereven","foreverof",
            "hahhahhah", "hahahahah"
        ];
        for(i=0;i<commons.length;i++){
            if(y.indexOf(commons[i]) > 0){
                return true;
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////
    var combinations = [];
    var noPunc = x.replace(/[.,\/#!?$%'\^&\*;:{}=\-_`~()]/g,"");
    var singleSpaces = noPunc.replace(/\s{2,}/g," "); //multiple spaces to one space
    var scrubbed = singleSpaces.toLowerCase();
    var words = scrubbed.split(" ");
    var counter = 0;
    for(i=0;i<words.length;i++){
        for(j=i;j<=words.length;j++){
            var segment = words.slice(i,j);
            if(segment.length >= 2){
                //console.log(segment);
                segment = segment.join("");
                var common = filterCommon(segment);
                if(common){
                    console.log("common palindrome: " + segment + " filtered out.")
                    return;
                }
                combinations.push(segment);
                counter++;
            }
        }
    }
    var sortedCombos = combinations.sort(function(a, b){
        return b.length - a.length;
    });
    //console.log(sortedCombos);
    sortedCombos.forEach(fS);
}
////////////////////\\\\\\\\\\\\\\\////////////////\\\\\\\\\\\\\\///////////////\\\\\\\\\\\\\\

function filterJunk(x){
    var y = "text: " + x.toLowerCase();
    var junk = [ //includes some common palindromes to avoid repeats, adding DB later...
        "dammit", "shit", "fuck", "pussy",
        " tits", "asshole", "fag", "faggot",
        " sex", "cum", " cunt", " jizz",
        " clit", " dick", "cocksucker",
        " porn", "nigger", "nigga", "retard",
        "bitch", "whore", "slut",
        "rape", "murder", "kill",
        "dead", "assault", "gunned", "terror",
        "attack", "bomb", "explode", "explosion",
        "sad", "condolences", "died", "death",
        "rest in peace", "fetish", "isis",
        "jihad", "arson", "trump", "racist",
        "racial", "xxx", "syria", "aleppo",
        "iran", "iraq", "afghanistan",
        "injure", "wound", "hurt", "depress",
        "sjw", "cuck", "hatred", "vagina"
    ];
    for(i=0;i<junk.length;i++){
        //console.log(junk[i]);
        if(y.indexOf(junk[i]) > 0){
            //console.log("found junk in text: " + junk[i]);
            return true;
        }
    }

}