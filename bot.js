var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);
var MongoClient = require('mongodb').MongoClient;
var URI = process.env.MONGODB_URI;

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
                var id = tweet.id_str;
                MongoClient.connect(URI, function(err,db){
                    db.collection('usedTweets').find({"tweetId":id},function(err,result){
                        if(err) throw err;
                        if(1 == 1){
                            //console.log("keeping going...");
                            console.log("result.tweetId = " + result.tweetId);
                            console.log("tweet.id_str = " + tweet.id_str);
                            console.log("type of result.tweetId = " + typeof result.tweetId);
                            console.log("type of tweet.id_str = " + typeof tweet.id_str);
                            console.log("do they equal?     " + result.tweetId == tweet.id_str);
                        }else{
                            console.log("no result found, this tweet is new to me: "  + tweet.text + "\n      tweet id = " + tweet.id_str);
                            //palindrometer(tweet.text,tweet.id_str,tweet.user.screen_name);
                            console.log("        ok, i've done something with it. now, i'm adding it to the archive...")
                            var tweetId = tweet.id_str;
                            db.collection('usedTweets').insertOne({"tweetId":tweetId})
                        }
                    });
                })
            }
        }else{
            console.log("Error: " + err)
        }
    })
}

//retweet();
setInterval(reply,15000);

//todo filter explicit tweets

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
                console.log("match")
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
        var number = function(){return Math.floor(Math.random()*10)}
        var banter = [
            'Nice palindrome! It is',
            'Cool - you made a palindrome that is',
            'Good work, your palindrome is',
            'Sweet palindrome ya got there. It is',
            'Boo, noob! Just kidding, you made a great palindrome. It is',
            'Ya got yerself a palindrome, there, pardner. By my reckoning, it is',
            'Fantastic palindrome - it is',
            'Ooh nice one. That palindrome is',
            'Pretty cool palindrome, looks to be',
            'Not too shabby. Your palindrome is'
        ]
        Twitter.post('statuses/update', { in_reply_to_status_id:tweetId, status:'@'+userName+ ' ' + banter[number()] + ' '+ element.length + ' characters long.' }, function (err, data, response) {
            console.log(data)
        });
        MongoClient.connect(URI, function(err,db){
            db.collection('usedTweets').insertOne({"tweetId":tweetId})
        });
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