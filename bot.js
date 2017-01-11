var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);
var stream = Twitter.stream('statuses/sample',{ language: 'en' });

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

//messing around:

function filterJunk(x){
    var y = "text: " + x.toLowerCase();
    var junk = [
        "dammit", "shit", "fuck", "pussy",
        " tits", "asshole", "fag", "faggot",
        " sex", "cum", " cunt", " jizz",
        " clit", " dick", "cocksucker",
        " porn", "nigger", "nigga", "retard",
        "bitch", "whore", "slut"
    ];
    for(i=0;i<junk.length;i++){
        //console.log(junk[i]);
        if(y.indexOf(junk[i]) > 0){
            //console.log("found junk in text: " + junk[i]);
            return true;
        }
    }
}