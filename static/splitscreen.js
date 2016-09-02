// navigate to a new url
function navigate() {
    var url = document.getElementById('url').value;
    // if url is empty and there is a placeholder, use placeholder instead
    if (url === "" && document.getElementById('url').placeholder) {
        url = document.getElementById('url').placeholder;
    }
    // add 'https' to the link if it's not already there
    if (url.indexOf('https') === -1) {
        url = 'https://' + url;
    }
    sess.relocate(url);
}

// exit session function
function exitSession() {
    sess.end('');
}

//update live feed
function update_feed(text) {
    var news = document.getElementById("news_feed");
    news.innerHTML = text;
}


// send a positive message to iframe1 
function goodReaction() {
    frame = document.getElementById("ifrm1").contentWindow;
    frame.postMessage(JSON.stringify({
        "command": "message",
        "data": "good"
    }), "https://surfly.com");
    update_feed("You sent positive vibes!");
}

// send a negative message to iframe1
function badReaction() {
    frame = document.getElementById("ifrm1").contentWindow;
    frame.postMessage(JSON.stringify({
        "command": "message",
        "data": "bad"
    }), "https://surfly.com");
    update_feed("You sent negative vibes!");
}

// ignore/acknowledge friend button
function ignoreFriend() {
    var friendsFrame = document.getElementById("ifrm2");
    var yourFrame = document.getElementById("ifrm1");
    var ignoreButton = document.getElementById("ignore");

    if (ignoreButton.innerHTML == "Ignore Friend") {
        // we hide our friend's iframe
        friendsFrame.style.visibility = "hidden";
        // we make our iframe the size of the screen
        yourFrame.style.width = "99%";
        // change button to acknowledge friend
        ignoreButton.innerHTML = "Acknowledge Friend";
        // send message to update feed on the other side
        friendsFrame.contentWindow.postMessage(JSON.stringify({
            "command": "message",
            "data": "Your friend is ignoring you!"
        }), 'https://surfly.com');
    } else {
        // we show our friend's iframe
        friendsFrame.style.visibility = "visible";
        // we shrink our frame
        yourFrame.style.width = "49%";
        // we change the button to ignore friend 
        ignoreButton.innerHTML = "Ignore Friend";
        // send message to update feed on the other side
        friendsFrame.contentWindow.postMessage(JSON.stringify({
            "command": "message",
            "data": "Your friend stopped ignoring you!"
        }), 'https://surfly.com');
    }
}

// return button (left arrow)
function back_button() {
    var index = 1;
    if (urls.indexOf(lastUrl) > 2) {
        index = urls.indexOf(lastUrl);
    }
    sess.relocate(urls[index - 1]);
}

// event listener
window.addEventListener('message', function(e) {
    var origin = event.origin || event.originalEvent.origin;
    if (origin === "https://surfly.com") {
        var string = JSON.stringify(e.data);
        if (string.indexOf('cobro_event')) {

            // the 2nd follower link
            if (string.match(/[0-9]{3}[-][0-9]{3}[-][0-9]{3}/)) {
                // extract the follower link from the message 
                var index = string.indexOf('https');
                var indexEnd = string.indexOf('origin');
                var flink = string.substring(index, indexEnd - 4);
                if (flink.indexOf('\\')) {
                    flink = flink.substring(0, flink.length);
                };
                // set the source of the second iframe to the follower link
                document.getElementById('ifrm2').src = flink;
            }

            // update placeholder when follower relocates
            if (string.indexOf("The follower relocated") !== -1 || string.indexOf("The leader relocated") !== -1) {
                var index = string.indexOf('data');
                var indexEnd = string.indexOf('origin');
                var info = string.substring(index + 9, indexEnd - 5);
                if (info.charAt(0) === 'T') {
                    if (info.indexOf('https') !== -1) {
                        var new_ph = info.substring(info.indexOf('https') + 8);
                    } else {
                        var new_ph = info.substring(info.indexOf('http') + 7);
                    }
                    document.getElementById('url').placeholder = new_ph;
                }
            }

            // update feed if your friend ignores/stops ignoring you
            if (string.indexOf("Your friend is ignoring you!") !== -1 || string.indexOf("Your friend stopped ignoring you!") !== -1) {
                var index = string.indexOf('data');
                var indexEnd = string.indexOf('origin');
                var info = string.substring(index + 9, indexEnd - 5);
                if (info.indexOf('!') !== -1) {
                    update_feed(info);
                }
            }

            // get current url (received from leader side)
            if (string.indexOf("Current url") !== -1) {
                var index = string.indexOf('data');
                var indexEnd = string.indexOf('origin');
                var info = string.substring(index + 9, indexEnd - 5);
                if (info.charAt(0) === 'C') {
                    var url = info.substring(info.indexOf('https'));
                    sess.relocate(url);
                }
            }

            // reactions
            var reactionFrame = document.getElementById('reaction_img');
            if (string.match(/(good)/) || string.match(/(bad)/)) {
                // if the data recieved is "good" set the source of reactionFrame to the happy image
                if (string.match(/(good)/)) {
                    reactionFrame.src = "../static/happycow.jpg";
                    update_feed("You received a like!");
                    // if the data recieved is "bad" the src of reactionFrame is the grumpy image
                } else {
                    reactionFrame.src = "../static/grumpy.jpg";
                    update_feed("You received a dislike!");
                }
                reactionFrame.style.visibility = 'visible';
                // the frame is hidden after 3 seconds 
                setTimeout(function() {
                    reactionFrame.style.visibility = "hidden";
                }, 3000);
            }
        }
    }
})
