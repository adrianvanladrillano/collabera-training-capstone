/*---------------------------Global---------------------------*/
let users = JSON.parse(localStorage.getItem('users'));
let uploads = JSON.parse(localStorage.getItem('uploads'));
let messages = JSON.parse(localStorage.getItem('messages'));
let users2;
let uploads2;
let messages2;


function mounted() {
    let data;
    let data2;
    let data3;
    $.ajax({
        type: "GET",
        url: 'http://localhost:3000/users',
        success: function (response) {
            data = response.data;
            // console.log(response)
        },
        async: false // <- this turns it into synchronous
    });
    $.ajax({
        type: "GET",
        url: 'http://localhost:3000/uploads',
        success: function (response) {
            data2 = response.data;
            // console.log(response)
        },
        async: false // <- this turns it into synchronous
    });
    $.ajax({
        type: "GET",
        url: 'http://localhost:3000/chats',
        success: function (response) {
            data3 = response.data;
            // console.log(response)
        },
        async: false // <- this turns it into synchronous
    });
    afterMounted(data, data2, data3);
}

function afterMounted(data, data2, data3) {
    users2 = data;
    uploads2 = data2;
    messages2 = data3;
}

let auth = {};

// Page setters
let userIndex = 0;
let uploadIndex = 0;
let getID = "";
let userID = "";

// Page fillers
let filename = '';
let shared = [];

/*---------------------------Parsers---------------------------*/
// Get the email of the user
// id = user ID
function parseEmail(id) {
    let getIndex = users2.map(el => el._id).indexOf(id);
    return getIndex != -1 ? users2[getIndex].email : 'Deleted user';
}

// Get the fullname of the user
// id = user ID
function parseFullname(id) {
    let getIndex = users2.map(el => el._id).indexOf(id);
    return getIndex != -1 ? users2[getIndex].name : 'Deleted user';
}

// Parser for document.cookie
// name = cookie name in the browser
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? matches[1] : undefined;
}

/*---------------------------Page Handlers---------------------------*/
// Validate and login user
function login() {

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let aPos = email.indexOf("@");
    let dotPos = email.lastIndexOf(".");

    let getIndex = users2.map(el => el.email).indexOf(email);
    if (users == null) {
        users = []
    }
    if (email == "" || password == "") {
        alert("Username/Password required.");
        return false;
    }
    else if (aPos < 1 || dotPos - aPos < 2) {
        alert("Invalid Email");
        return false;
    }
    else {
        $.ajax({
            type: "POST",
            url: 'http://localhost:3000/users/auth',
            data: { email: email, password: password },
            success: function (response) {
                sessionID = response.session;
                if (response.status == "success") {
                    sessionStorage.setItem("user", sessionID);
                    // document.cookie = "user=" + JSON.stringify(response.data) + ";path=/";
                    console.log(response)
                    return false
                }
                else {
                    console.log(response)
                    alert('Wrong Username/Password')
                    return false
                }
            },
            async: false // <- this turns it into synchronous
        });
    }
    return true
}

// RouteGuard/Check if the user is already logged in
function checkLoggedIn() {
    // if (sessionStorage.getItem('user')) {
    //     location.href = 'login-success.html'
    // }
}

// Route Guard/Check if the cookie is existing
function getAuth() {
    let loggedIn = sessionStorage.getItem("user")
    // let cookie_name = getCookie('user');
    if (loggedIn === null) {
        location.href = '/frontend/users/login.html';
    }
    else {
        sessionStorage.getItem('user');
        let userIndex = users2.map(el => el._id).indexOf(sessionStorage.getItem('user'));
        auth = users2[userIndex];
    }
}

// Logout/Remove the cookie
function logout() {
    sessionStorage.removeItem("user");
    getAuth();
}


/*---------------------------Setters---------------------------*/
// Fetch the user contents in users edit page
function setUser() {
    // let user = JSON.parse(localStorage.getItem('user'))
    let url = new URL(window.location.href);
    let search_params = url.searchParams;
    if (search_params.has('id')) {
        getID = search_params.get('id')
        userIndex = users2.map(user => user._id).indexOf(getID);
        document.getElementById('fullname').value = users2[userIndex].name;
        document.getElementById('email').value = users2[userIndex].email;
    }
}

// Fetch the upload contents in uploads page
function setUpload() {
    let url = new URL(window.location.href);
    let search_params = url.searchParams;
    if (search_params.has('id')) {
        console.log(search_params.get('id'));
        let getID = parseInt(search_params.get('id'));
        uploadIndex = uploads.map(upload => upload.id).indexOf(getID);
        document.getElementById('file_desc').value = uploads[uploadIndex].label;
    }
}

// Fetch the upload contents in shared page
function setSharing() {
    let url = new URL(window.location.href);
    let search_params = url.searchParams;
    if (search_params.has('id')) {
        getID = search_params.get('id');
        uploadIndex = uploads2.map(upload => upload._id).indexOf(getID);
        filename = uploads2[uploadIndex].label;
        shared = uploads2[uploadIndex].shared === null ? [] : uploads2[uploadIndex].shared === '' ? [] : JSON.parse(uploads2[uploadIndex].shared);
    }
}

/*---------------------------Fillers---------------------------*/
//Fill users table in users page
// function fillUsers() {
//     if (users2 == null) {
//         users2 = [];
//     }
//     for (let index = 0; index < users2.length; index++) {
//         const user = users[index];
//         document.write(`
//         <tr>
//             <td>${user.fullname}</td>
//             <td class="text-align-center">${user.email}</td>
//             <td align="center" width="25%">
//                 <a href="edit.html?id=${user.id}" class="text-decoration-none">Edit</a>
//                 <span>|</span>
//                 <button class="btn-no-border" onclick=showModal(${user.id})> Delete </button>
//             </td>
//         </tr>`);
//     }
// }

function fillUsers2() {
    console.log(users2)
    if (users2 == null) {
        users2 = [];
    }
    for (let index = 0; index < users2.length; index++) {
        const user = users2[index];
        document.write(`
        <tr>
            <td>${user.name}</td>
            <td class="text-align-center">${user.email}</td>
            <td align="center" width="25%">
                <a href="edit.html?id=${user._id}" class="text-decoration-none">Edit</a>
                <span>|</span>
                <button class="btn-no-border" onclick=showModal("${user._id}")> Delete </button>
            </td>
        </tr>`);
    }

}

// when clicked ok in the modal
function fillUploads() {
    if (uploads == null) {
        uploads = [];
    }
    console.log(uploads2)
    for (let index = 0; index < uploads2.length; index++) {
        const upload = uploads2[index];
        if (upload.parent == auth._id) {
            document.write(`
            <tr>
            <td>${upload.label}</td>
            <td class="text-align-center">
                <a href="http://localhost:3000/${upload.filename}" target="_blank"> 
                    ${upload.filename}
                </a>
            </td>
            <td align="center" width="25%">
                <button onclick="showModalEdit('${upload._id}')"  class="btn-no-border">Edit</button>
                <span>|</span>
                <button onclick="showModal('${upload._id}')"  class="btn-no-border">Delete</button>
                <span>|</span>
                <a href="share.html?id=${upload._id}" class="text-decoration-none">Share</a>
            </td>
        </tr>`);
        }
    }
}

// Fill shared users table in shared users
function fillSharing() {
    for (let index = 0; index < shared.length; index++) {
        const share = shared[index];
        const shared_index = users2.map(el => el._id).indexOf(share);
        document.write(`
        <tr>
            <td width="50%">${users2[shared_index].name}</td>
            <td width="50%" align="center">
            <button onclick="showModalShare('${getID}', '${share}')" class="btn-no-border">Remove</button>
            </td>
        </tr>`);
    }
}

function fillChat() {
    let builder = '';

    if (messages2 == null) {
        messages2 = [];
    }
    let scrollBottom = () => {
        let chat_container = document.getElementById('chat');
        chat_container.scrollTop = chat_container.scrollHeight;
    }

    let looper = () => {
        for (let index = 0; index < messages2.length; index++) {
            const element = messages2[index];
            builder += `<p>[${element.timestamp}] ${parseFullname(element.from)}: ${element.message}</p>`;
        }
    }

    // Initial load
    looper();
    $('#chat').html(builder);
    scrollBottom();

    setInterval(() => {
        builder = ''
        mounted();
        looper();
        $('#chat').html(builder);
        scrollBottom();
    }, 1000);
}

//Fill shared uploads table in uploads page
function fillShared() {
    for (let index = 0; index < uploads2.length; index++) {
        const upload = uploads2[index];

        let testShare = upload.shared === null ? [] : upload.shared === '' ? [] : JSON.parse(upload.shared);

        if (upload.parent != auth._id && testShare.map(el => el).indexOf(auth._id) != -1) {
            console.log(upload)
            document.write(`
            <tr>
              <td>${upload.label}</td>
              <td class="text-align-center">
                <a href="http://localhost:3000/${upload.filename}" target="_blank"> 
                    ${upload.filename}
                </a>
              </td>
              <td align="center" width="25%">
               ${parseEmail(upload.parent)}
               </td>
            </tr>`);
        }
    }
}

// Fill select on page users
function fillDropdown() {
    for (let index = 0; index < users2.length; index++) {
        const user = users2[index];

        let testShare = uploads2[uploadIndex].shared === null ? [] : uploads2[uploadIndex].shared === '' ? [] : JSON.parse(uploads2[uploadIndex].shared)

        let shared = testShare.indexOf(user._id.toString());

        if (shared < 0 && user._id != auth._id) {
            document.write(`
            <option class="text-align-center" value="${user._id}">
                ${user.name}
            </option>`);
        }
    }
}

/*---------------------------Create/New---------------------------*/
// User registration function
function register() {
    let fullname = document.getElementById('fullname').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let password2 = document.getElementById('password2').value;

    var aPos = email.indexOf("@");
    var dotPos = email.lastIndexOf(".");

    if (email == '' || password == '' || password2 == '' || fullname == '') {
        alert('Username/Email/Password is required');
        return false;
    }
    else if (aPos < 1 || dotPos - aPos < 2) {
        alert('Email is not valid');
        return false;
    }
    else if (password != password2) {
        alert('Password and confirm password should match.');
        return false;
    }
    if (users == null) {
        users = [];
    }
    let newUser = {
        id: Number(new Date()),
        name: fullname,
        email: email,
        password: password
    };
    console.log(newUser)

    $.ajax({
        type: "POST",
        url: 'http://localhost:3000/users',
        data: newUser,
        success: function (response) {
            return true
        },
    });
    return true
    // users.push(newUser);
    // localStorage.setItem('users', JSON.stringify(users));
}

// Groupchat chat function
function addMessage() {
    let today = new Date();
    let parse_date = today.toISOString().replace('T', ' ').replace('Z', '').slice(0, 19);
    let message = document.getElementById('message').value;
    if (message == '') {
        alert('Input is required');
        return false;
    }
    if (messages == null) {
        messages = [];
    }
    let newMessage = {
        id: Number(new Date()),
        message: message,
        timestamp: parse_date,
        from: auth._id
    };
    messages.push(newMessage);

    $.ajax({
        type: "POST",
        url: 'http://localhost:3000/chats',
        data: newMessage,
        success: function (response) {
            return false
        },
    });

    // localStorage.setItem('messages', JSON.stringify(messages));
    $('#chat').html(fillChat());
    message = document.getElementById('message').value = ''
    return true;

}

// Share user and push into shared array
function userAssign() {
    let share_user = document.getElementById('share_user').value;
    if (share_user == '') {
        alert('User required');
        return false;
    }
    else {
        shared.push(share_user);
        let uploadObj = {
            ...uploads2[uploadIndex],
            shared: JSON.stringify(shared)
        };
        console.log(uploadObj)
        // uploads2[uploadIndex] = uploadObj;
        //Dito po
        $.ajax({
            type: "PUT",
            url: `http://localhost:3000/uploads/${getID}`,
            data: uploadObj,
            success: function (response) {
                console.log(response)
            },
            async: false // <- this turns it into synchronous
        });
        location.href = 'share.html?id=' + uploads2[uploadIndex]._id;
        return false
        // localStorage.setItem('uploads', JSON.stringify(uploads));
    }
}

//Validate and create upload and store it on the localstorage
function upload(file) {

}

function addFile() {

    let formData = new FormData();
    let file_desc = document.getElementById('file_desc').value;
    let filename

    if (file_desc == '') {
        alert('File description is required');
        return false;
    }
    if (!fileinput.files[0]) {
        alert('File is required')
        return false;
    }
    if (fileinput.files[0].size > 10000000) {
        alert('File too large (Max 10MB)')
        return false;
    }
    formData.append("file", fileinput.files[0]);

    $.ajax({
        type: "POST",
        url: 'http://localhost:3000/uploads/files',
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,  // Important!
        contentType: false,
        cache: false,
        success: function (response) {
            filename = response.file_uploaded
        },
        async: false // <- this turns it into synchronous
    });

    let newUpload = {
        id: Number(new Date()),
        label: file_desc,
        filename: filename,
        parent: auth._id,
        shared: []
    };
    $.ajax({
        type: "POST",
        url: 'http://localhost:3000/uploads',
        data: newUpload,
        success: function (response) {
            return true
        },
    });
    return true
}

/*---------------------------Delete---------------------------*/
// Delete upload from the local storage when clicked ok in the modal
function deleteUpload() {
    let mapIndex = uploads2.map(upload => upload._id).indexOf(getID);
    $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/uploads/${getID}&${uploads2[mapIndex].filename}`,

        success: function (response) {
            console.log(response)
            return true
        },
        async: false // <- this turns it into synchronous
    });
    location.href = 'index.html';
}

// Delete user from the local storage when clicked ok in the modal
function deleteUser() {
    // let mapIndex = users.map(user => user._id).indexOf(getID);
    // users.splice(mapIndex, 1);
    // localStorage.setItem('users', JSON.stringify(users));
    console.log(getID)
    $.ajax({
        type: "DELETE",
        url: `http://localhost:3000/users/${getID}`,
        success: function (response) {
            return true
        },
        async: false // <- this turns it into synchronous
    });
    location.href = 'index.html';
}

//Remove user from the shared array inside uplods
// ayusin ko l8r
function removeUser() {
    let get_user = userID;
    let get_upload = getID;

    let upload_index = uploads2.map(upload => upload._id).indexOf(get_upload);
    let mapRemove = JSON.parse(uploads2[upload_index].shared).map(el => el).indexOf(get_user);

    parseShare = JSON.parse(uploads2[upload_index].shared);
    parseShare.splice(mapRemove, 1);
    console.log(parseShare);

    let uploadObj = {
        ...uploads2[upload_index],
        shared: JSON.stringify(parseShare)
    };
    console.log(uploadObj)
    $.ajax({
        type: "PUT",
        url: `http://localhost:3000/uploads/${getID}`,
        data: uploadObj,
        success: function (response) {
            console.log(response)
        },
    });
    location.href = 'share.html?id=' + uploads2[uploadIndex]._id;
    return false
    // localStorage.setItem('uploads', JSON.stringify(uploads));
    // location.href = 'share.html?id=' + get_upload;
}

/*---------------------------Update---------------------------*/
// Update user from the local storage
function userUpdate() {
    let fullname = document.getElementById('fullname').value;
    let email = document.getElementById('email').value;

    var aPos = email.indexOf("@");
    var dotPos = email.lastIndexOf(".");

    if (fullname == '' || email == '') {
        alert('fullname/email is mandatory');
        return false;
    }
    else if (aPos < 1 || dotPos - aPos < 2) {
        alert('email is not valid');
        return false;
    }
    let userObj = {
        ...users2[userIndex],
        name: fullname,
        email: email,
    };
    $.ajax({
        type: "PUT",
        url: `http://localhost:3000/users/${getID}`,
        data: userObj,
        success: function (response) {
            return true
        },
        async: false // <- this turns it into synchronous
    });
    return true
    // users[userIndex] = userObj;
    // localStorage.setItem('users', JSON.stringify(users));
    // return true;
}

// Update uploads from the local storage
function uploadUpdate() {
    let edit_desc = document.getElementById('edit_desc').value;
    let index = uploads2.map(el => el._id).indexOf(getID);
    let uploadObj = {
        ...uploads2[index],
        label: edit_desc,
    };

    $.ajax({
        type: "PUT",
        url: `http://localhost:3000/uploads/${getID}`,
        data: uploadObj,
        success: function (response) {
            return true
        },
        async: false // <- this turns it into synchronous
    });
    uploads2[index] = uploadObj;

    // localStorage.setItem('uploads', JSON.stringify(uploads));
    // return true
}

/*-----------------------Modals & Utilities -----------------------*/
//Show modal delete and set the global variable
// id = user/upload id;
function showModal(id) {
    document.getElementById("modal").style.visibility = "visible";
    getID = id;
}


//Show modal edit and set the global variable
// upload = upload ID
// user = user ID
function showModalShare(upload, user) {
    document.getElementById("modal-share").style.visibility = "visible";
    getID = upload;
    userID = user;
}

//Show modal upload in file uploads
function showModalUpload() {
    document.getElementById("modal-upload").style.visibility = "visible";
}

//Show modal edit, set the global variable and fill the textbox in file uploads
function showModalEdit(id) {
    document.getElementById("modal-edit").style.visibility = "visible";
    let index = uploads2.map(el => el._id).indexOf(id);
    document.getElementById('edit_desc').value = uploads2[index].label;
    getID = id;
}

