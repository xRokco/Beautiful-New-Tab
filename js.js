$(document).ready(function() {
	//Background
	function backdrop() {

		if (localStorage.getItem('imgSaved')) {
			console.log("trying to get saved image");
			var imgSaved = localStorage.getItem('imgSaved');
			document.getElementById("body").style.backgroundImage = "url('"+imgSaved+"')";
			var linkSaved = localStorage.getItem('linkSaved');
			var nameSaved = localStorage.getItem('nameSaved');
			var credit = 'Photo by <a href="' + linkSaved + '" target="_blank">' + nameSaved + '</a> on Unsplash';
			document.getElementById('infodiv').innerHTML = credit;
		} else {
			console.log("backup");
			backup();
		}

		var unsplashAPI = config.unsplashAPI;
		var randNum = Math.floor(Math.random() * 2);
		var width = document.body.clientWidth;
		var categories = ["2", "4"]

		$.getJSON('https://api.unsplash.com/photos/random?client_id=' + unsplashAPI + '&featured=true&category=' + categories[randNum] + '&orientation=landscape&w='+width, function(data) {
			var url = data.urls.full;
			var link = data.user.links.html;
			var name = data.user.name;

			localStorage.clear();

			var img1= new Image();
			img1.setAttribute('crossOrigin', 'anonymous');
			img1.src = url;
			img1.onload = function(e) {
				//console.log(img1);
				imgData = getBase64Image(img1);
				localStorage.setItem("imgSaved", imgData);
				localStorage.setItem("linkSaved", link);
				localStorage.setItem("nameSaved", name);
			};
		}).error(function() { 
			backup();
		});
	}

	backdrop();
	$('#info').click(function(){
		backdrop();
	});

	$('#info').hover(function(){
		document.getElementById('infodiv').style.opacity = 1;
	});

	$('#infodiv').click(function(){
		document.getElementById('infodiv').style.opacity = 0;
	});

	function backup() {
		var code = String(Math.floor((Math.random() * 9) + 1));
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
		document.getElementById("infodiv").innerHTML = alttext;
	}


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
		//console.log(data);
		var temp = Math.round(data.main.temp - 273.15);
		var now = new Date().getTime() / 1000;

		if(now > data.sys.sunrise && now < data.sys.sunset){
			var suffix = '-d';
			} else {
			var suffix = '-n';
			}

		document.getElementById('weather').innerHTML = '<i class="owf owf-' + data.weather[0].id + suffix + '"></i> ' + temp + '&#8451';
	});
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/jpeg");

    return dataURL;
}