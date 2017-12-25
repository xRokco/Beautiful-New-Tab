chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	console.log("page opened");
	getBase64Image();
});

$(document).ready(function() {
	chrome.storage.sync.get('links', function (obj) {
		console.log("Set initial options");
        if (obj.categories || !obj.collections) {
            delete obj.categories;
            chrome.storage.sync.set({
                collections: ['935527']
            });
        }
        if (obj.links) {
        	chrome.tabs.create({'url':'/options.html'})
            chrome.storage.sync.set({
                temperature: 'c',
                time: 24,
                links: [
                    {
                        label: 'Facebook',
                        link: 'http://facebook.com'
                    },
                    {
                        label: 'Google',
                        link: 'http://google.com'
                    },
                    {
                        label: 'Reddit',
                        link: 'http://reddit.com'
                    },
                    {
                        label: 'Options',
                        link: '/options.html'
                    }
                ],
                raw: false,
                weather: '',
                unsplash: '',
                additional: '',
                collections: ['935527']
            });
        }
    });
});

function getBase64Image() {
	var unsplashAPI = config.unsplashAPI;
	//var width = document.body.clientWidth;
	
	//get the image url, photographer name and Unsplash profile of a random image from the Unsplash API.
	chrome.storage.sync.get(['unsplash', 'collections', 'additional'], function (obj) {
        if(obj.unsplash && obj.unsplash != ''){
            unsplashAPI = obj.unsplash;
        }

        if(obj.additional){
        	var additional = obj.additional.split(",");

        	obj.collections = obj.collections.concat(additional)
        }

        if(obj.collections.length == 0){
        	obj.collections = ["935527", "719"]; //default collection to use if none others are set - Yosemite
        }

        console.log(obj.collections);

        //clear the local storage of any previous data.
		//console.log(obj.collections);
		var url = 'https://api.unsplash.com/photos/random?client_id=' + unsplashAPI + '&collections=' + obj.collections.toString() + '&orientation=landscape';
		//console.log(url);
		$.getJSON(url, function(data) {
			var url = data.urls.full;
			var link = data.user.links.html;
			var name = data.user.name;

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
			    //console.log(imgData.length);
			    if(imgData.length < 5000000) {
			    	localStorage.clear();
			    }
				//save the base64 url and the metadata.
				
				// var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
				// console.log(db);
				// db.transaction(function (tx) {  
   	// 				tx.executeSql('CREATE TABLE IF NOT EXISTS IMAGE (imgData, unsplashLink, photographerName)');
   	// 				tx.executeSql('DELETE FROM IMAGE');
   	// 				tx.executeSql('INSERT INTO IMAGE (imgData, unsplashLink, photographerName) VALUES (?, ?, ?)', [imgData, link, name]);
				// });

				try {
					localStorage.setItem("imgSaved", imgData);
					localStorage.setItem("linkSaved", link);
					localStorage.setItem("nameSaved", name);
					console.log("success, image cached");
				} catch(err) {
					console.log("failed, retrying");
					getBase64Image();
				}
			};
		}).error(function() { //if the API call fails, run the backup function
			console.log("error in API call");
		});
	});
}