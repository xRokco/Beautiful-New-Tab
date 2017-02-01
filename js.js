$(document).ready(function() {
	//Background
	function backdrop() {
		var code = String(Math.round(8*Math.random()+1));
		var altcode = code;
		while (code.length < 3) {
				code = "0" + code;
		};
		var backgroundcode = "resources/" + code + ".jpg";
		document.getElementById("body").style.backgroundImage = "url('"+backgroundcode+"')";
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

		var alttext = alt[altcode];
		document.getElementById("info").title = alttext;
	}

	backdrop();
	$('#info').click(function(){
		backdrop();
	});

	//Date and Time
	function checkTime(i) {
	    if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
    	return i;
	}

	function startTime() {
		var today=new Date();
		var h=today.getHours();
		var m=today.getMinutes();
		var d=today.getDate();
		var month = ["January","February","March","April","May","June","July","August","September","October","November","December"]

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

		var n = month[today.getMonth()];
		m = checkTime(m);
		h = checkTime(h)
		document.getElementById('txt').innerHTML = h+":"+m;
		document.getElementById('txt2').innerHTML = d + " " + n;
		var t = setTimeout(function(){startTime()},500);
	}
	startTime();

	//weather geolocation
	navigator.geolocation.getCurrentPosition(function(position) {
		loadWeather(position.coords.latitude, position.coords.longitude); //load weather using your lat/lng coordinates
	});
});

//weather
function loadWeather(lat, lon) {
	var owAPi = config.owAPI;
	$.getJSON('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+ owAPi, function(data) {
		console.log(data);
		var temp = data.main.temp - 273.15;
		var now = new Date().getTime() / 1000;

		if(now > data.sys.sunrise && now < data.sys.sunset){
			var suffix = '-d';
			} else {
			var suffix = '-n';
			}

		document.getElementById('weather').innerHTML = '<i class="owf owf-' + data.weather[0].id + suffix + '"></i> ' + temp + '&#8451';
	});
}