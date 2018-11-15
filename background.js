chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    console.log("page opened");
    getBase64Image();
});

$(document).ready(function() {
    chrome.storage.sync.get(null, function (obj) {
        console.log("Set initial options");
        if (obj.categories ) {
            chrome.storage.sync.remove(categories);
        }

        if (!obj.collections) {
            chrome.storage.sync.set({
                collections: ['935527']
            });
        }

        if (!obj.links) {
            //chrome.tabs.create({'url':'/options.html'})
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
        var url = 'https://api.unsplash.com/photos/random?client_id=' + unsplashAPI + '&collections=' + obj.collections.toString() + '&orientation=landscape';
        $.getJSON(url, function(data) {
            var url = data.links.download_location;
            var link = data.links.html;
            var name = data.user.name;

            $.getJSON(url + '?client_id=' + unsplashAPI, function(data) {
                //create a new image to cache
                var img= new Image();
                img.setAttribute('crossOrigin', 'anonymous'); //set this attribute to get around cross origin canvas security stuff.
                img.src = data.url;
                img.onload = function(e) { //when the img loads, do some stuff
                    var canvas = document.createElement("canvas"); //create a canvas
            
                    //set canvas width and height to image width and height
                    canvas.width = img.width;
                    canvas.height = img.height;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0); //add the image to the canvas

                    var imgData = canvas.toDataURL("image/jpeg"); //convert canvas to base64 data url

                    chrome.storage.local.clear();

                    try {
                        // localStorage.setItem("imgSaved", imgData);
                        // localStorage.setItem("linkSaved", link);
                        // localStorage.setItem("nameSaved", name);
                        chrome.storage.local.set({
                            imgSaved: imgData,
                            linkSaved: link,
                            nameSaved: name
                        });
                        console.log("success, image cached");
                    } catch(err) {
                        console.log("failed, retrying");
                        getBase64Image();
                    }
                };
            });
        }).error(function() { //if the API call fails, run the backup function
            console.log("error in API call");
        });
    });
}