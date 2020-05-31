String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var displayName;
var email;
var emailVerified;
var photoURL;
var isAnonymous;
var uid;
var providerData;
var thisRef;
var storageRef;
var file;
var storage;
var pass;
var user;
var list = [];
var firebaseRef = firebase.database().ref('sdss-student');
var firebasePassRef = firebase.database().ref('_pa55w0rd');
var emailListRef = firebase.database().ref('emailList');

function postSys() {
    var holder = document.getElementById("posts");
    var emailText; 
    var textFFF;
    var textFF;
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
            titleFF = ffData[k].title;
            textFFF = ffData[k].post;
            urlFF = ffData[k].photoURL;

            var div = document.createElement('div');
            div.className += "posts";
            div.id += keys[i];
            textFF = textFFF.replaceAll("~", "<");
            textFF = textFFF.replaceAll("#", ">");

            if (urlFF != undefined) {
                innerDiv = '<h1>' + titleFF + '</h1>' + '<p>' + textFF + '</p>' + '<button onclick="ImageShow(this)" id="' + urlFF + '" class="picBtn">View Image</button>' + '<button onclick="Edit(this)">Edit</button>' + '<button id="' + titleFF + '~' + textFFF + '~' + urlFF + '" onclick="email1(this)">Email</button>' + '<button onclick="Delete(this)">Delete</button>';
            } else {
                innerDiv = '<h1>' + titleFF + '</h1>' + '<p>' + textFF + '</p>' + '<button onclick="Edit(this)">Edit</button>' + '<button id="' + titleFF + '~' + textFFF + '" onclick="email1(this)">Email</button>' + '<button onclick="Delete(this)">Delete</button>';
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

function htmlEdit(x) {
    var html;
    if (x == "editor1") {
        var htmlRaw = CKEDITOR.instances.editor1.document.getBody().getHtml();
    } 
    else if (x == "edText"){
        var htmlRaw = CKEDITOR.instances.edText.document.getBody().getHtml();
    }
    else{
        htmlRaw = "<ERROR>";
        return html;
    }
    if (htmlRaw != " " || htmlRaw != null || htmlRaw != "") {
        html = htmlRaw.replaceAll("<", "~");
        html = htmlRaw.replaceAll(">", "#");
    }
    return html;
}

function _passwdSyS() {
    var fpData;
    var keysP;

    firebasePassRef.on("value", gotData, errData);

    function gotData(data) {
        fpData = data.val();
        keysP = Object.keys(fpData);

        for (var i = keysP.length - 1; i >= 0; i--) {
            var k = keysP[i];
            user = fpData[k].user;
            pass = fpData[k].password;
        }
    }

    function errData(data) {
        console.log("Error!!");
        console.log(data);
    }
}

function ImageShow(element) {
    var url = element.id;
    var modal = document.getElementById('imgModal');
    var modalImg = document.getElementById("img01");
    modal.style.display = "block";
    modalImg.src = url;
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }
}

function signOut() {
    firebase.auth().signOut();
    location.reload();
}

function email1(data) {
    _passwdSyS();
    CKEDITOR.instances["edBody"].setData(" ");
    var Raw = data.id;
    var rawArray = Raw.split('~');
    var tileEm = rawArray[0];
    var textEm = rawArray[1];
    var urlEm = rawArray[2];
    var holder = document.getElementById("email");
    var innerLi;
    var feData;
    var keysE;
    var textReady;

    textReady = textEm.replaceAll("~", "<");
    textReady = textEm.replaceAll("#", ">");
    emailListRef.on("value", gotData, errData);

    function gotData(data) {
        $('.emailDd').remove();
        feData = data.val();
        keysE = Object.keys(feData);

        for (var i = 0; i < keysE.length; i++) {
            var k = keysE[i];
            list[i] = feData[k].email;
            var li = document.createElement('li');
            li.className += "emailDd";

            innerLi = '<li class="emailL">' + '<a>' + list[i] + '</a>' + '</li>';

            li.innerHTML = innerLi;
            holder.appendChild(li);
        }
    }

    function errData(data) {
        console.log("Error!!");
        console.log(data);
    }

    if (rawArray.length == 3) {
        $("#emTitle").val(tileEm);
        CKEDITOR.instances["emBody"].insertHtml(textReady);
        $("#emUrl").val(urlEm);
        $("#emailBox").modal();
    } else if (rawArray.length == 2) {
        $("#emTitle").val(tileEm);
        CKEDITOR.instances["emBody"].insertHtml(textReady);
        $("#emailBox").modal();
    } else {
        alert("ERROR!");
    }
}

function email() {
    _passwdSyS();

    var holder = document.getElementById("email");
    var innerLi;
    var feData;
    var keysE;
    emailListRef.on("value", gotData, errData);

    function gotData(data) {
        $('.emailDd').remove();
        feData = data.val();
        keysE = Object.keys(feData);

        for (var i = 0; i < keysE.length; i++) {
            var k = keysE[i];
            list[i] = feData[k].email;
            var li = document.createElement('li');
            li.className += "emailDd";

            innerLi = '<li class="emailL">' + '<a>' + list[i] + '</a>' + '</li>';

            li.innerHTML = innerLi;
            holder.appendChild(li);
        }
    }

    function errData(data) {
        console.log("Error!!");
        console.log(data);
    }
}

function pushEmail() {
    var listRaw = $(".emailL").toArray();
    var list = [];
    var title = $("#emTitle").val();
    var message = CKEDITOR.instances["emBody"].document.getBody().getText();
    var url = $("#emUrl").val();

    if (url !== undefined || url !== " " || url !== "" || url !== null || url !== ' ') {
        pushEmailwImage();
    } else {
        for (var i = 0; i < listRaw.length; i++) {
            list[i] = listRaw[i].innerText;
        }
        for (var i = 0; i < list.length; i++) {
            Email.send("sdssstudentcouncil1@gmail.com",
                list[i],
                title,
                message,
                "smtp.gmail.com",
                user,
                pass);
        }
        user = "";
        pass = "";
        alert("sent");
        CKEDITOR.instances["edBody"].setData(" ");
    }
}

function pushEmailwImage() {
    var listRaw = $(".emailL").toArray();
    var list = [];
    var title = $("#emTitle").val();
    var message = CKEDITOR.instances["emBody"].document.getBody().getText();
    var image = $("#emUrl").val();

    for (var i = 0; i < listRaw.length; i++) {
        list[i] = listRaw[i].innerText;
    }
    for (var i = 0; i < list.length; i++) {
        Email.sendWithAttachment("sdssstudentcouncil1@gmail.com",
            list[i],
            title,
            message,
            "smtp.gmail.com",
            user,
            pass,
            image);
    }
    user = "";
    pass = "";
    alert("sent");
    CKEDITOR.instances["edBody"].setData(" ");
}

function alertPost(title, message, user, picExist) {
    if (picExist) {
        Email.send("message@spartanstuco.com",
            "zeeshanbadr@gmail.com",
            title,
            message + " with image by " + user,
            "smtp.gmail.com",
            user,
            pass
        );
    } else {
        Email.send("message@spartanstuco.com",
            "zeeshanbadr@gmail.com",
            title,
            message + " by " + user,
            "smtp.gmail.com",
            user,
            pass
        );
    }
    user = "";
    pass = "";
}

function FBlogin() {
    if (firebase.auth().currentUser) {
        firebase.auth().signOut();
    } else {
        var email = document.getElementById('userName').value;
        var password = document.getElementById('_passwd').value;
        if (email.length < 4) {
            alert('Please enter an email address!');
            return;
        }
        if (password.length < 4) {
            alert('Please enter an password!');
            return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password!');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                displayName = user.displayName;
                email = user.email;
                emailVerified = user.emailVerified;
                photoURL = user.photoURL;
                isAnonymous = user.isAnonymous;
                uid = user.uid;
                providerData = user.providerData;
                $("#loginBox").modal("hide");
            }
        });
    }
}

function Delete(post) {
    var div = post.parentElement;
    var delKey = div.id;

    firebase.database().ref().child('/sdss-student/' + delKey).remove()
}

function Edit(post) {
    var div = post.parentElement;
    var title = div.firstChild.innerText;
    var textRaw = div.querySelector("p");
    var text = textRaw.innerHTML; 
    editKey = div.id;

    $('#editBox').modal();
    $('#edTitle').attr('value', title);
    CKEDITOR.instances["edText"].insertHtml(text);//setData(text);
}

function EditPush() {
    var title = $('#edTitle').val();
    var text = htmlEdit("edText");
    var editTime = formatDate();

    firebase.database().ref().child('/sdss-student/' + editKey)
        .update({
            title: title,
            post: text,
            edited: true,
            editTime: editTime
        });

    $('#edTitle').attr('value', " ");
    $('#edText').attr('value', " ");
    CKEDITOR.instances["edText"].setData(" ");
    $('#editBox').modal('hide');
}

function previewFile() {
    storage = firebase.storage();
    file = document.getElementById("files").files[0];
    console.log(file);
    storageRef = firebase.storage().ref();
    thisRef = storageRef.child(file.name);
    thisRef.put(file).then(function(snapshot) {
        console.log(snapshot);
    });
}

function passReset() {
    firebase.auth().sendPasswordResetEmail($('#userName').val()).catch(function(error) {
        alert(error);
    });
}

function formatDate() {
    var date;
    var d = new Date()
    var weekday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")
    var monthname = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
    date = d.getHours() + ":" + d.getMinutes() + "--" + weekday[d.getDay()] + "-" + d.getDate() + "-" + monthname[d.getMonth()] + "-" + d.getFullYear();
    return date;
}

function addEmail() {
    var email = $('#addEmail').val();
    if (email == null || email == undefined || email == " " || email == ' ' || email == "" || email == '') {
        alert("Error: Please enter an email address.");
    } else {
        emailListRef.push().set({
            email: email
        });
        alert(email + " added!");
    }
}

function submit() {
    var title = $('#title').val();
    var post = htmlEdit("editor1");
    var time = formatDate();
    var picExist = false;
    if (thisRef != null || thisRef != undefined) {
        thisRef.getDownloadURL().then(function(url) {
            if (title == "" && post == "") {
                alert("Error: Fields are empty!");
            } else if (title == "" && post != "") {
                alert("Error: Title field is empty!");
            } else if (title != "" && post == "") {
                alert("Error: Text field is empty!");
            } else {
                firebaseRef.push().set({
                    title: title,
                    post: post,
                    user: uid,
                    date: time,
                    edited: false,
                    photoURL: url
                });
                picExist = true;
                alert("Poster successfully!");
                _passwdSyS();
                alertPost(title, post, uid, picExist);
            }
        });
    } else {
        if (title == "" && post == "") {
            alert("Error: Fields are empty!");
        } else if (title == "" && post != "") {
            alert("Error: Title field is empty!");
        } else if (title != "" && post == "") {
            alert("Error: Text field is empty!");
        } else {
            firebaseRef.push().set({
                title: title,
                post: post,
                user: uid,
                date: time,
                edited: false
            });
            alert("Poster successfully!");
        }
    }
};

function dropDown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

$(document).resize(function(event) {
    if (calendar) {
        $(window).resize(function() {
            var calHeight = $(window).height() * 0.83;
            $('#calendar').fullCalendar('option', 'height', calHeight);
        });
    };
});

$('#emailBox').on('hidden.bs.modal', function() {
    $("#emUrl").val(' ');
})

$(document).ready(function() {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,listYear'
        },
        displayEventTime: false, // don't show the time column in list view
        // THIS KEY WON'T WORK IN PRODUCTION!!!
        // To make your own Google API key, follow the directions here:
        // http://fullcalendar.io/docs/google_calendar/
        googleCalendarApiKey: 'AIzaSyA8fEJKzbHzdC3iUFtKfpDLePxY87eFZiM',
        // US Holidays
        eventSources: [
            'gapps.yrdsb.ca_g6eubc7fu0lrli264vbthj2mnc@group.calendar.google.com',
            'gapps.yrdsb.ca_oivtit2itq6o8ab75ecc1589to@group.calendar.google.com'
        ],
        eventClick: function(event) {
            // opens events in a popup window
            window.open(event.url, 'gcalevent', 'width=700,height=600');
            return false;
        },
        loading: function(bool) {
            $('#loading').toggle(bool);
        }
    });
    var calHeight = $('.page-r').height();
    $('#calendar').fullCalendar('option', 'height', calHeight);
    postSys();
    $('#fullpage').fullpage({
        responsiveWidth: 768
    });
    $("#loginBox").modal({
        backdrop: 'static',
        keyboard: false
    });
    CKEDITOR.replace('editor1');
    CKEDITOR.replace('edText');
    CKEDITOR.replace('emBody');
});