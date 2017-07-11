$(document).ready(function() {
    //backdrop();
    chrome.runtime.sendMessage({text: "newtab"});

    //generate a new image on click of the info button
    $('#info').click(function(){
        backdrop();
        chrome.runtime.sendMessage({text: "newtab"});
    });

    //show the image credit on hover of the info button
    $('#info').hover(function(){
        document.getElementById('infodiv').style.opacity = 1;
    }, function() {
        document.getElementById('infodiv').style.opacity = 0;
    });

    //Get a background image
    function backdrop() {
        // var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

        // db.transaction(function (tx) { //check if you have an image cached, if so, use it
        //     tx.executeSql('SELECT * FROM IMAGE', [], function (tx, results) {
        //         if(results.rows.length > 0){
        //             document.getElementById("body").style.backgroundImage = "url('"+results.rows[0].imgData+"')";
        //             var credit = 'Photo by <a href="' + results.rows[0].unsplashLink + '?utm_source=newtabpage&utm_medium=referral&utm_campaign=api-credit" target="_blank">' + results.rows[0].photographerName + '</a> on Unsplash';
        //             document.getElementById('infodiv').innerHTML = credit;
        //         } else {
        //             console.log("no image cached, using backup image");
        //             backup();
        //         }
        //     }, null);
        // });

        //check if you have an image cached, if so, use it
        if (localStorage.getItem('imgSaved')) {
            console.log("trying to get saved image");
            //set the background to the cached image
            var imgSaved = localStorage.getItem('imgSaved');
            document.getElementById("body").style.backgroundImage = "url('"+imgSaved+"')";
            //update the image metadata previously cached
            var linkSaved = localStorage.getItem('linkSaved');
            var nameSaved = localStorage.getItem('nameSaved');
            var credit = 'Photo by <a href="' + linkSaved + '?utm_source=beautifulnewtab&utm_medium=referral&utm_campaign=api-credit" target="_blank">' + nameSaved + '</a> on Unsplash';
            document.getElementById('infodiv').innerHTML = credit;
        } else {
            console.log("no image cached, using backup image");
            backup();
        }
    }

    //This function is called when there's an issue getting an image fron Unsplash
    function backup() {
        var code = String(Math.floor((Math.random() * 5) + 1)); //get a random integer between 1 and 4 inclusive

        //store the random int from above in a new variable in order to get the credit from the array 
        var altcode = code;

        //pad the random number from above with zeroes until it's 3 digits long.
        while (code.length < 3) {
                code = "0" + code;
        };

        //set the body background to a random image gotten from the random int above 
        var backgroundcode = "resources/" + code + ".jpg";
        document.getElementById("body").style.backgroundImage = "url('"+backgroundcode+"')";

        //create an array of the image credit
        var alt = new Array();
        alt[0] = "";
        alt[1] = "Photo by <a href='https://unsplash.com/@aleskrivec?utm_source=beautifulnewtab&utm_medium=referral&utm_campaign=api-credit' target='_blank'>Ales Krivec</a> on Unsplash";
        alt[2] = "Photo by <a href='https://unsplash.com/@blakeverdoorn?utm_source=beautifulnewtab&utm_medium=referral&utm_campaign=api-credit' target='_blank'>Blake Richard Verdoorn</a> on Unsplash";
        alt[3] = "Photo by <a href='https://unsplash.com/@dannyfroese?utm_source=beautifulnewtab&utm_medium=referral&utm_campaign=api-credit' target='_blank'>Danny Froese</a> on Unsplash";
        alt[4] = "Photo by <a href='https://unsplash.com/@reddangelo16?utm_source=beautifulnewtab&utm_medium=referral&utm_campaign=api-credit' target='_blank'>Redd Angelo</a> on Unsplash";
        alt[5] = "Photo by <a href='https://unsplash.com/@henrymcintosh?utm_source=beautifulnewtab&utm_medium=referral&utm_campaign=api-credit' target='_blank'>Henry McIntosh</a> on Unsplash";

        //get the correct value from the array from the random in for the image
        var alttext = alt[altcode];
        document.getElementById("infodiv").innerHTML = alttext;
    }

    backdrop();

    //Date and Time
    function checkTime(i) {
        if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }


    //get date and time
    function startTime() {
        //get current date and time
        var today=new Date();
        var h=today.getHours();
        var m=today.getMinutes();
        var d=today.getDate();
        var month = ["January","February","March","April","May","June","July","August","September","October","November","December"]

        //add the superscript st, nd, rd and th to the date value
        var j = d % 10,
            k = d % 100;
        if (j == 1 && k != 11) {
            d = d + "<sup>st</sup>";
        } else if (j == 2 && k != 12) {
            d = d + "<sup>nd</sup>";
        } else if (j == 3 && k != 13) {
            d = d + "<sup>rd</sup>";
        } else {
            d = d + "<sup>th</sup>";
        }

        //format date as 1st January
        var n = month[today.getMonth()];
        m = checkTime(m);
        h = checkTime(h);

        chrome.storage.sync.get('time', function (obj) {
            if(obj.time == 12){
                var ampm = h >= 12 ? 'pm' : 'am';
                h = h % 12;
                h = h ? h : 12; // the hour '0' should be '12'
                document.getElementById('txt').innerHTML = h+':'+m+ '<span id="small"> ' + ampm + '</span>';
            } else {
                document.getElementById('txt').innerHTML = h+":"+m;
            }
        });

        document.getElementById('txt2').innerHTML = d + " " + n;
        var t = setTimeout(function(){startTime()},500);//run this function every half second to update the time.
    }
    startTime();

    //get the location of the user for the weather API
    navigator.geolocation.getCurrentPosition(function(position) {
        loadWeather(position.coords.latitude, position.coords.longitude); //load weather using your lat/lng coordinates
    });

    linkPopulate();
});

//get weather
function loadWeather(lat, lon) {
    var owAPi = config.owAPI; //OpenWeather API

    //get the temperature and image icon ID from openweather api
    chrome.storage.sync.get(['weather', 'temperature'], function (obj) {
        if(obj.weather && obj.weather != ''){
            owAPi = obj.weather;
        }

        $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+ owAPi, function(data) {
            //console.log(data);
            var temp = Math.round(data.main.temp - 273.15); //convert temperature to celcius.
            if(obj.temperature == 'f'){
                console.log('fahr');
                temp = Math.round((temp * (9/5)) + 32);
                code = '&deg;F';
            } else if (obj.temperature == 'c') {
                code = '&deg;C';
            } else {
                temp = Math.round(data.main.temp);
                code = 'K';
            }

            var now = new Date().getTime() / 1000; //get current time in seconds to check if it's night or day

            if(now > data.sys.sunrise && now < data.sys.sunset){ //if it's daytime (after sunright and before sunset)
                var suffix = '-d'; //append a "-d" to get a daytime icon
            } else {
                var suffix = '-n'; //otherwise append an "-n" for nighttime icon
            }

            //set the temperature with weather icon
            document.getElementById('weather').innerHTML = '<i class="owf owf-' + data.weather[0].id + suffix + '"></i> ' + temp + code;
        });
    });
}

function linkPopulate() {
    chrome.storage.sync.get(['raw', 'links', 'bookmark'], function (obj) {
        if(obj.raw == false && obj.links.length > 0) {
            var text = '<ul>';
            for (var i = 0; i < obj.links.length; i++) {
                text += '<li><a href="' + obj.links[i].link + '">' + obj.links[i].label + '</a></li>';
            }
            text += '</ul>';
            document.getElementById("txt3").innerHTML = text;
        } else {
            document.getElementById("txt3").innerHTML = obj.links;
        }

        if(obj.bookmark){
            chrome.bookmarks.getTree(function(data){
                var text = "";
                for (var i = 0; i < data[0].children[0].children.length; i++) {
                    if(data[0].children[0].children[i].url){
                        if (!data[0].children[0].children[i].title) {
                            var title = "";
                        } else {
                            var title = data[0].children[0].children[i].title.substring(0, 16);
                        }

                        text += "<a href=\"" + data[0].children[0].children[i].url + "\" class=\"bookmark\"><img src=\"chrome://favicon/" + data[0].children[0].children[i].url + "\" /><span class=\"title\">" + title + "</span></a>";
                    } else {
                    }           
                }
                $("#bookmarks").html(text);
            });
        }
    });
}