var link;
var domain = "https://mathildej.github.io";

var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
// Listen to message from child IFrame window
eventer(messageEvent, function(e) {
    var origin = event.origin || event.originalEvent.origin;
    if (origin === domain) {
	    var string = JSON.stringify(e.data);
	    // check to see if the string contains the session id 
	    if (string.match(/[0-9]{3}[-][0-9]{3}[-][0-9]{3}/)) {
		link = string.substring(1, string.length - 1);
		document.getElementById("inviteLink").value = link;
	    }
    }
}, false);

$(document).ready(function() {
    $('#copyLink').click(function() {
        var copiedLink = document.getElementById('inviteLink');
        // select the content
        copiedLink.select();
        document.execCommand('copy');
    });

    $('#mail').click(function() {
        // get text input from the input
        var address = document.getElementById('enterEmail').value;
        var inviteLink = document.getElementById('inviteLink').value;
        $("#mail_link").attr("href", "mailto:" + address + "?subject=Invitation%20to%20splitscreen%20session&body=You%20have%20been%20invited%20to%20a%20splitscreen%20session!%0D%0AClick <a>" + inviteLink + "</a>%20to%20join%20");
    });


});
