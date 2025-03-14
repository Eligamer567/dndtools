// Set a cookie with a username
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Get a cookie value
function getCookie(name) {
    let nameEq = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEq) == 0) return c.substring(nameEq.length, c.length);
    }
    return "";
}

// Delete a cookie
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

// Save username and set a cookie
function saveUsername() {
    let username = document.getElementById("username-input").value;
    if (username) {
        setCookie("username", username, 7); // Set cookie for 7 days
        displaySavedUsername();
    }
}

// Display saved username from cookie
function displaySavedUsername() {
    let username = getCookie("username");
    if (username) {
        document.getElementById("saved-username").textContent = `Hello, ${username}!`;
    } else {
        document.getElementById("saved-username").textContent = "No username saved.";
    }
}

// Load saved username on page load
window.onload = function() {
    displaySavedUsername();
};
