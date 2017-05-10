// Saves options to chrome.storage
function save_options() {
    var temperature = document.getElementById('temperature').value;
    var time = document.getElementById('time').value;
    var links = document.getElementsByClassName('link');
    var labels = document.getElementsByClassName('label');
    var arr = [];
    var raw = document.getElementById('raw').checked

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
        raw: raw
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
    // Use default value color = 'red' and likesColor = true.
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
        raw: false
    }, function(items) {
        document.getElementById('temperature').value = items.temperature;
        document.getElementById('time').value = items.time;
        document.getElementById('raw').checked = items.raw;
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