$(document).ready(function() {
	//backdrop();
	chrome.runtime.sendMessage({text: "newtab"});

	//generate a new image on click of the info button
	$('#info').click(function(){
		backdrop();
	});

	//show the image credit on hover of the info button
	$('#info').hover(function(){
		document.getElementById('infodiv').style.opacity = 1;
	});

	//hide the image credit box when you click on it
	$('#infodiv').click(function(){
		document.getElementById('infodiv').style.opacity = 0;
	});

	//Get a background image
	function backdrop() {
		//check if you have an image cached, if so, use it
		if (localStorage.getItem('imgSaved')) {
			console.log("trying to get saved image");
			//set the background to the cached image
			var imgSaved = localStorage.getItem('imgSaved');
			document.getElementById("body").style.backgroundImage = "url('"+imgSaved+"')";
			//update the image metadata previously cached
			var linkSaved = localStorage.getItem('linkSaved');
			var nameSaved = localStorage.getItem('nameSaved');
			var credit = 'Photo by <a href="' + linkSaved + '" target="_blank">' + nameSaved + '</a> on Unsplash';
			document.getElementById('infodiv').innerHTML = credit;
		} else {
			console.log("no image cached, using backup image");
			backup();
		}
	}

	//This function is called when there's an issue getting an image fron Unsplash
	function backup() {
		var code = String(Math.floor((Math.random() * 9) + 1)); //get a random integer between 1 and 9 inclusive

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
		alt[1] = "Mt. McKinley, Alaska.";
		alt[2] = "Lofoten Islands, Norway.";
		alt[3] = "Volcán de Fuego, Guatemala. Photo by Andrew Shepard.";
		alt[4] = "Steptoe Butte State Park, Washington. Photo by Craig Goodwin.";
		alt[5] = "Arches National Park, Utah. Photo by Patrik Oberlin.";
		alt[6] = "Antelope Canyon, Arizona.";
		alt[7] = "Svalbard, Norway. Photo by Paul Nicklen.";
		alt[8] = "Twelve Apostles, Australia.";
		alt[9] = "Alabama Hills, CA.";

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

		document.getElementById('txt').innerHTML = h+":"+m;
		document.getElementById('txt2').innerHTML = d + " " + n;
		var t = setTimeout(function(){startTime()},500);//run this function every half second to update the time.
	}
	startTime();

	//get the location of the user for the weather API
	navigator.geolocation.getCurrentPosition(function(position) {
		loadWeather(position.coords.latitude, position.coords.longitude); //load weather using your lat/lng coordinates
	});
});

//get weather
function loadWeather(lat, lon) {
	var owAPi = config.owAPI; //OpenWeather API

	//get the temperature and image icon ID from openweather api
	$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+ owAPi, function(data) {
		//console.log(data);
		var temp = Math.round(data.main.temp - 273.15); //convert temperature to celcius.
		var now = new Date().getTime() / 1000; //get current time in seconds to check if it's night or day

		if(now > data.sys.sunrise && now < data.sys.sunset){ //if it's daytime (after sunright and before sunset)
			var suffix = '-d'; //append a "-d" to get a daytime icon
		} else {
			var suffix = '-n'; //otherwise append an "-n" for nighttime icon
		}

		//set the temperature with weather icon
		document.getElementById('weather').innerHTML = '<i class="owf owf-' + data.weather[0].id + suffix + '"></i> ' + temp + '&#8451';
	});
}

//Convert an image to base64 URL
function getBase64Image(img) {
    var canvas = document.createElement("canvas"); //create a canvas
    
    //set canvas width and height to image width and height
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0); //add the image to the canvas

    var dataURL = canvas.toDataURL("image/jpeg"); //convert canvas to base64 data url

    return dataURL; //return the URL
}