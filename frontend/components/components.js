// render navbar
// active = the page you are in
function navbar(active) {
    document.write(`
    <div class="tab">
    <a href="/frontend/groupchat.html">
        <button class="tablinks" id="gc">Group Chat</button>
    </a>
    <a href="/frontend/users/index.html">
        <button class="tablinks" id="user">Manage Users</button>
    </a>
    <a href="/frontend/docmgt">
        <button class="tablinks" id="docs">Manage Documents</button>
    </a>
        <button class="tablinks" onclick="logout()">Logout</button>
    </div>`);
    if (active == 'gc') {
        document.getElementById('gc').style = 'background: white;color: black';
    }
    if (active == 'user') {
        document.getElementById('user').style = 'background: white;color: black';
    }
    if (active == 'docs') {
        document.getElementById('docs').style = 'background: white;color: black';
    }
}

// Render page header
// title = page header title
function pageHeader(title) {
    return document.write(`<div class="px-1"><h1>${title}</h1></div>`);
}

// Render table headers
// headers = array of names for table headers
function tableHeader(headers) {
    let builder = '<tr>';
    for (let index = 0; index < headers.length; index++) {
        const element = headers[index];
        builder += `<th class="fw-regular">${element}</th>`;
    }
    return document.write(builder + '</tr>');
}

// Insert empty row 
// count = number of rows
// type = if existing show only 2 columns
function emptyRow(count, type) {
    let builder = '';
    if (type) {
        for (let index = 0; index < count; index++) {
            builder += `
            <tr>
                <td class="text-align-center"></td>
                <td>
                    &nbsp
                </td>
            </tr>`;
        }
    }
    else {
        for (let index = 0; index < count; index++) {
            builder += `
            <tr>
                <td></td>
                <td class="text-align-center"></td>
                <td>
                    &nbsp
                </td>
            </tr>`;
        }
    }
    return document.write(builder);
}

// Render modal header delete 
// title = modal title
function modalHeaderDelete(title) {
    return document.write(`
    <div class="modal-header py-2">
        <span>${title}</span>
        <a href="index.html">
            <span class="btn-exit-small">
                X
            </span>
        </a>
    </div>
    <div class="py-10">
        <div class="d-block overflow-hidden">
            <img src="../img/help.png" alt="" width="70%">
        </div>
        <div class="d-block overflow-hidden">
            <h3>Are you Sure?</h3>
        </div>
    </div>`);
}

// Render modal header 
// title = modal title
function modalHeader(title) {
    return document.write(`
    <div class="modal-header py-2 text-align-center">
        <span class="fw-bold d-block ">${title}</span>
        <a href="index.html">
            <span class="btn-exit-small">
                X
            </span>
        </a>
    </div>`);
}