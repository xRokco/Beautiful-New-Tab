chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	console.log("page opened");
	getBase64Image();
});

function getBase64Image() {
	var unsplashAPI = config.unsplashAPI;
	var randNum = Math.floor(Math.random() * 2); //get random integer between 0 and 1 inclusive.
	var width = document.body.clientWidth;
	var categories = ["2", "4"]; //possible unsplash categories to pick from. 2 = nature, 4 = buildings.

	//get the image url, photographer name and Unsplash profile of a random image from the Unsplash API.
	$.getJSON('https://api.unsplash.com/photos/random?client_id=' + unsplashAPI + '&featured=true&category=' + categories[randNum] + '&orientation=landscape&w='+width, function(data) {
		var url = data.urls.full;
		var link = data.user.links.html;
		var name = data.user.name;

		//clear the local storage of any previous data.
		localStorage.clear();

		//create a new image to cache
		var img= new Image();
		img.setAttribute('crossOrigin', 'anonymous'); //set this attribute to get around cross origin canvas security stuff.
		img.src = url;
		img.onload = function(e) { //when the img loads, do some stuff
			 var canvas = document.createElement("canvas"); //create a canvas
    
		    //set canvas width and height to image width and height
		    canvas.width = img.width;
		    canvas.height = img.height;

		    var ctx = canvas.getContext("2d");
		    ctx.drawImage(img, 0, 0); //add the image to the canvas

		    var imgData = canvas.toDataURL("image/jpeg"); //convert canvas to base64 data url
			//save the base64 url and the metadata.
			console.log("length");
			console.log(imgData.length);
			
			localStorage.setItem("imgSaved", imgData);
			localStorage.setItem("linkSaved", link);
			localStorage.setItem("nameSaved", name);
		};
	}).error(function() { //if the API call fails, run the backup function
		console.log("error in API call");
	});
}