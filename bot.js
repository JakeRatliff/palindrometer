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

 */




var reply = function(){
    var params = {
        q: '@palindrometer%20-from%3Apalindrometer', //palindrome%20OR%20palindrometer
        result_type: 'recent',
        lang: 'en'
    };

    Twitter.get('search/tweets', params, function(err, data){
        if(!err){
            //console.log("data.statuses.length = " + data.statuses.length)
            var tweet = data.statuses[0];
            if(tweet){
                MongoClient.connect(URI, function(err,db){
                    db.collection('usedTweets').findOne({"tweetId":tweet.id_str},function(err,result){
                        if(err) throw err;
                        if(result){
                            //console.log("already found that tweet, keeping going...");
                        }else{
                            console.log("no result found, this tweet is new to me: "  + tweet.text + "\n      tweet id = " + tweet.id_str);
                            for(i=0;i<tweet.text.length;i++){
                                console.log(tweet.text[i]);
                            }
                            palindrometer(tweet.text,tweet.id_str,tweet.user.screen_name);

                        }
                    });
                })
            }


        }else{
            console.log("Error: " + err)
        }
    })
};

//retweet();
var twelveHours = 1000*60*60*12;
var upCheck = function(){
    console.log("...I'm awake...")
};
setInterval(reply,10000);
setInterval(upCheck, twelveHours);

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
//todo filter explicit tweets

////////////////////\\\\\\\\\\\\\\\////////////////\\\\\\\\\\\\\\///////////////\\\\\\\\\\\\\\



////////////////\\\\\\\\\\\\\\\\//////////////
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
        var number = function(){return Math.floor(Math.random()*14)};
        var banter = [
            'Nice palindrome! It is',
            'Cool - you made a palindrome that is',
            'Good work, your palindrome is',
            'Sweet palindrome ya got there. It is',
            'Boo, noob! Just kidding, you made a palindrome. It is',
            'Ya got yerself a palindrome, there, pardner. By my reckoning, it is',
            'Fantastic palindrome - it is',
            'Ooh nice one. That palindrome is',
            'Pretty cool palindrome, looks to be',
            'Not too shabby. Your palindrome is',

            'Beep. Boop. I am a bot who finds palindromes. Palindrome detected. It is',
            'I love the smell of palindromes in the morning. Especially ones that are',
            'That\'s a spicy palindrome! It is',
            'woah... thats, like, a dope \'drome you made bruh. its, like,'
        ];
        Twitter.post('statuses/update', { in_reply_to_status_id:tweetId, status:'@'+userName+ ' ' + banter[number()] + ' '+ element.length + ' characters long.' }, function (err, data, response) {
            console.log(data.text)
        });
        console.log("        ok, i've done something with it. now, i'm adding it to the archive...");
        MongoClient.connect(URI, function(err,db){
            db.collection('usedTweets').insertOne({"tweetId":tweetId});
        });
    }
    //////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////
    var combinations = [];
    var noPunc = x.replace(/[.,\/\"#!?$%\'\^&\*;:{}=\-_`~()]/g,"");
    //var noPalindrometer = noPunc.replace(/@palindrometer/g, '');
    var noLineBreaks = noPunc.replace(/\n/g,' ');
    var singleSpaces = noLineBreaks.replace(/\s{2,}/g," "); //multiple spaces to one space
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
