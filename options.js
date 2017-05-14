// Saves options to chrome.storage
function save_options() {
    var temperature = document.getElementById('temperature').value;
    var time = document.getElementById('time').value;
    var links = document.getElementsByClassName('link');
    var labels = document.getElementsByClassName('label');
    var arr = [];
    var catarray = [];
    var raw = document.getElementById('raw').checked
    var weather = document.getElementById('weather').value;
    var unsplash = document.getElementById('unsplash').value;
    var categories = document.getElementsByClassName('categories');
    var featured = document.getElementById('featured').checked;

    for (var i = 0; i < categories.length; i++){
        if(categories[i].checked){
            catarray.push(categories[i].name);
        }
    }

    // console.log(catarray);

    if(raw == false){
        for (var i = 0; i < links.length; i++) {
            arr.push({
                label: labels[i].value,
                link: links[i].value
            });
        }    
    } else {
        var arr = document.getElementById("advanced").value;
    }
  
    chrome.storage.sync.set({
        temperature: temperature,
        time: time,
        links: arr,
        raw: raw,
        weather: weather,
        unsplash: unsplash,
        categories: catarray,
        featured: featured
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
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
        ],
        raw: false,
        weather: '',
        unsplash: '',
        categories: [2, 4],
        featured: true
    }, function(items) {
        document.getElementById('temperature').value = items.temperature;
        document.getElementById('time').value = items.time;
        document.getElementById('raw').checked = items.raw;
        document.getElementById('weather').value = items.weather;
        document.getElementById('unsplash').value = items.unsplash;
        document.getElementById('featured').checked = items.featured;
        for (var i = 0; i < items.categories.length; i++){
            document.getElementsByName(items.categories[i])[0].checked = true;
        }
        if(items.raw == true){
            document.getElementById('advanced').value = items.links;    
        } else {
            for (var i = 0; i < items.links.length; i++) {
                document.getElementsByClassName('link')[i].value = items.links[i].link;
                document.getElementsByClassName('label')[i].value = items.links[i].label;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

var acc = document.getElementsByClassName("accordion");
var i;

acc[0].onclick = function(){
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
}