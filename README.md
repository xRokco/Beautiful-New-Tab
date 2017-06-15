# New-Tab
## What this does
A newtab page for Chrome just for me, or for you with some minor code changes!

This will replace the new tab page on Chrome with a pretty image of nature or buildings, and include links to certain websites of your choice, the current time and date and the temperature + weather in your location.

You can hover over the 'i' icon in the top right for photo information, or click it to get a new photo.

## Installation and configuration
If you're cloning this and want the it to work you'll need an OpenWeather API key (you can get a free one from their site) and a Unsplash Developer API key, also from their site. The former is for the weather info and the latter to get the images.

Put the key in a file called config.js which is in this format
~~~~
var config = {
  owAPI : 'MY_OW_API_KEY_HERE',
  unsplashAPI : 'MY_UNSPLASH_API_KEY_HERE'
}
~~~~

You will also probably want to change the links to websites that are displayed to websites that you want. You can do this by changing the raw html itself. You can use my links as examples for changing them.

To install, there are a couple of ways, both require you to be in developer mode in Chrome. Go to chrome://extensions/ and click Developer Mode in the top right, then, either -

1. Click 'Load Unpacked Extension...', navigate to the directory you just cloned and click OK. Done.
2. Package the extension by clicking 'Pack Extension...' and then click on Extension root directory and browse to the cloned directory and click OK. This will create a CRX file alongside the cloned directory, you can install from this by dragging it into the chrome://extensions/ or opening it Chrome. Done.

## Permissions
This extension needs a couple of permissions and here's what they are and why they are needed -
- **geolocation** - This is used to get your Lat and Lon values for the weather reporting
- **storage** - This is used to cache the images to reduce load and render time when you open a new tab
- **bookmarks** - This is to get your Chrome bookmarks to populate the (currently unfinished) bookmark bar feature
- **chrome://favicon/** - This is also used by the bookmark bar feature to get the favicons chrome has cached

That's it!

![Alt](http://i.imgur.com/UR36A5K.jpg "Title")
