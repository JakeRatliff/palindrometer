var twit = require('twit');
var config = require('./config.js');
var Twitter = new twit(config);

var retweet = function(){
    var params = {
        q: 'trump',
        result_type: 'recent',
        lang: 'en'
    };

    Twitter.get('search/tweets', params, function(err, data){
        if(!err){
            var retweetId = data.statuses[0].id_str;
            Twitter.post('statuses/retweet/:id', {
                id: retweetId
            }, function(err,response){
                if(response){
                    console.log("Retweeted!!!");
                }
                if(err){
                    console.log("There was an error when Retweeting, duplication?")
                }
            });
        }else{
            console.log("Something when wrong when Searching...")
        }
    })
};
//retweet();
//setInterval(retweet, 5000)

/////////////////////////////
function followerIds() { //lists numeric ids of followers of the given handle
    Twitter.get('followers/ids', {screen_name: '_JakeRatliff'}, function (err, data, response) {
        console.log(data)
    })
}
/////////////////////////////
function findTweetsAbout(x){
    Twitter.get('search/tweets',
        { q: x + ' since:2016-07-01', count: 100 },
        function(err, data, response) {
        console.log(data)
    })
}

//findTweetsAbout("Jake Ratliff");
////////////////////////////

var sanfran = [ '-122.75', '36.8', '-121.75', '37.8'];

var stream = Twitter.stream('statuses/sample',{ language: 'en' });

stream.on('tweet', function (tweet) {
    palindrometer(tweet.text,tweet.id_str);
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