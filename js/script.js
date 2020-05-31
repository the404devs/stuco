String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var scrolled = 0;

function FillPost() {
    var firebaseRef = firebase.database().ref('sdss-student');
    //
    var holder = document.getElementById("posts");
    var textFF;
    var textFFF;
    var titleFF;
    var ffData;
    var keys;

    firebaseRef.on("value", gotData, errData);

    function gotData(data) {
        $('.posts').remove();
        ffData = data.val();
        keys = Object.keys(ffData);

        for (var i = keys.length - 1; i >= 0; i--) {
            var k = keys[i];
            var innerDiv;
            titleFF = ffData[k].title;
            textFFF = ffData[k].post;
            urlFF = ffData[k].photoURL;

            var div = document.createElement('div');
            div.className += "posts";
            textFF = textFFF.replaceAll("~", "<");
            textFF = textFFF.replaceAll("#", ">");

            if (urlFF != undefined) {
                innerDiv = '<h1>' + titleFF + '</h1>' + '<p>' + textFF + '</p>' + '<button onclick="ImageShow(this)" id="' + urlFF + '" class="picBtn">View Image</button>';
            } else {
                innerDiv = '<h1>' + titleFF + '</h1>' + '<p>' + textFF + '</p>';
            }
            div.innerHTML = innerDiv;
            holder.appendChild(div);
        }
    }

    function errData(data) {
        console.log("Error!!");
        console.log(data);
    }
}

function ImageShow(element) {
    var url = element.id;
    console.log(url);
    var modal = document.getElementById('imgModal');
    var modalImg = document.getElementById("img01");
    modal.style.display = "block";
    modalImg.src = url;
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
}

$(document).resize(function(event) {
    if (calendar) {
        $(window).resize(function() {
            var calHeight = $(window).height() * 0.83;
            $('#calendar').fullCalendar('option', 'height', calHeight);
        });
    };
});

$(document).ready(function() {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,listYear'
        },
        displayEventTime: true,

        googleCalendarApiKey: 'AIzaSyA8fEJKzbHzdC3iUFtKfpDLePxY87eFZiM',

        eventSources: [
            'gapps.yrdsb.ca_g6eubc7fu0lrli264vbthj2mnc@group.calendar.google.com',
            'gapps.yrdsb.ca_oivtit2itq6o8ab75ecc1589to@group.calendar.google.com'
        ],
        eventClick: function(event) {

            window.open(event.url, 'gcalevent', 'width=700,height=600');
            return false;
        },
        loading: function(bool) {
            $('#loading').toggle(bool);
        }
    });
    var calHeight = $('.page-l').height();
    $('#calendar').fullCalendar('option', 'height', calHeight);
    FillPost();
    $('#fullpage').fullpage({
        responsiveWidth: 768
    });
});