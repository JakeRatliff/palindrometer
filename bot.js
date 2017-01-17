var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);
var URI = process.env.MONGODB_URI;
console.log(URI);

/*
var stream = Twitter.stream('statuses/filter',{ track: 'palindrome','palindrometer'});

stream.on('tweet', function (tweet) {
    var filtered = filterJunk(tweet.text);
    if(filtered){
        console.log("filtered tweet")
    }else{
        palindrometer(tweet.text,tweet.id_str);
    }
});
//////////////// or this:
Twitter.stream('statuses/filter', { track: 'hey'}, function (stream) {
    stream.on('tweet', function (tweet) {
        console.log(tweet);
        var filtered = filterJunk(tweet.text);
        if(filtered){
            console.log("filtered tweet")
        }else{
            palindrometer(tweet.text,tweet.id_str);
        }
    });
});
*/



var reply = function(){
    var params = {
        q: '@palindrometer%20-from%3Apalindrometer', //palindrome%20OR%20palindrometer
        result_type: 'recent',
        lang: 'en'
    }

    Twitter.get('search/tweets', params, function(err, data){
        if(!err){
            var tweet = data.statuses[0];
            //console.log("@username = " + tweet.user.screen_name);
            //console.log(tweet);
            if(tweet){
                palindrometer(tweet.text,tweet.id_str,tweet.user.screen_name);
            }
        }else{
            console.log("Error: " + err)
        }
    })
}

//retweet();
setInterval(reply,15000);

//todo filter explicit tweets, add db so no repeats.

function palindrometer(x,y,z){
    var tweetId = y;
    var userName = z;
    /////////////////////////////////////////////////////////////////////////
    function fS(element){ //or 'find symmetry'
        var minLength = 7; //minimum character length of palindrome,
        // excluding spaces and punctuation, which will have been scrubbed already.
        var x = element;
        if(x.length<minLength){
            return false
        }
        var z = x.length;
        for(i=0;i<=x.length/2;i++){
            z--;
            if(x[i] == x[z]){
            }else{
                return "No symmetry here."
            }
        }
        console.log("Found a palindrome! It is: " + element + ". It is " + element.length + " characters long. Nice!");
        /*
        Twitter.post('statuses/retweet/:id', { id: tweetId }, function (err, data, response) {
            console.log(data)
        })
        */
        Twitter.post('statuses/update', { in_reply_to_status_id:tweetId, status:'@'+userName+' Nice palindrome! It is ' + element.length + ' characters long.' }, function (err, data, response) {
            console.log(data)
        })
    }
    //////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////
    var combinations = [];
    var noPunc = x.replace(/[.,\/#!?$%'\^&\*;:{}=\-_`~()]/g,"");
    var singleSpaces = noPunc.replace(/\s{2,}/g," "); //multiple spaces to one space
    var scrubbed = singleSpaces.toLowerCase();
    var words = scrubbed.split(" ");
    for(i=0;i<words.length;i++){
        for(j=i;j<=words.length;j++){
            var segment = words.slice(i,j);
            //console.log(segment);
            segment = segment.join("");
            combinations.push(segment);
        }
    }
    var sortedCombos = combinations.sort(function(a, b){
        return b.length - a.length;
    });
    //console.log(sortedCombos);
    sortedCombos.forEach(fS);
}
////////////////////\\\\\\\\\\\\\\\////////////////\\\\\\\\\\\\\\///////////////\\\\\\\\\\\\\\



////////////////\\\\\\\\\\\\\\\\//////////////
/*
function palindrometer(x){

    /////////////////////////////////////////////////////////////////////////
    function fS(element){ //or 'find symmetry'
        var minLength = 7; //minimum character length of palindrome,
        // excluding spaces and punctuation, which will have been scrubbed already.
        var x = element;
        if(x.length<minLength){
            return false
        }
        var z = x.length;
        for(i=0;i<=x.length/2;i++){
            z--;
            if(x[i] == x[z]){
            }else{
                return false
            }
        }
        console.log("Found a palindrome! It is: " + element + ". It is " + element.length + " characters long. Nice!");

    }
    //////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////
    var combinations = [];
    var noPunc = x.replace(/[.,\/#!?$%'\^&\*;:{}=\-_`~()]/g,"");
    var singleSpaces = noPunc.replace(/\s{2,}/g," "); //multiple spaces to one space
    var scrubbed = singleSpaces.toLowerCase();
    var words = scrubbed.split(" ");
    for(i=0;i<words.length;i++){
        for(j=i;j<=words.length;j++){
            var segment = words.slice(i,j);

            //console.log(segment);
            segment = segment.join("");
            combinations.push(segment);

        }
    }
    var sortedCombos = combinations.sort(function(a, b){
        return b.length - a.length;
    });
    //console.log(sortedCombos);
    sortedCombos.forEach(fS);
}
    */