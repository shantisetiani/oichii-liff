window.onload = function() {
    const useNodeJS = false;   // if you are not using a node server, set this value to false
    const defaultLiffId = "1655317738-8B2aBEK6";   // change the default LIFF value if you are not using a node server
 
    // DO NOT CHANGE THIS
    let myLiffId = "";
 
    // if node is used, fetch the environment variable and pass it to the LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
            .then(function(reqResponse) {
                return reqResponse.json();
            })
            .then(function(jsonResponse) {
                myLiffId = jsonResponse.id;
                initializeLiffOrDie(myLiffId);
            })
            .catch(function(error) {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
            });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }

    if (!liff.isInClient()) {
        document.getElementById("btn_scan_no").classList.add('hidden');
        document.getElementById("scan_qr_result").classList.remove('hidden');
    }
};
 
/**
* Check if myLiffId is null. If null do not initiate liff.
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiffOrDie(myLiffId) {
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}
 
/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId) {
    liff
        .init({
            liffId: myLiffId
        })
        .then(() => {
            // start to use LIFF's api
            initializeApp();
        })
        .catch((err) => {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
}
 
/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
    registerButtonHandlers();
 
    // check if the user is logged in/out, and disable inappropriate button
    if (liff.isLoggedIn()) {
        $('#btn_login').hide();
        if (liff.isInClient()) {
            $('#btn_logout').hide();
            $('#btn_logout_onscroll').hide();
        }else {
            $('#btn_logout').show();
            $('#btn_logout_onscroll').show();
        }

        liff.getProfile().then(function(profile) {
            document.getElementById('profile_info').classList.remove('hidden')
            document.getElementById('user_id').textContent = profile.userId;
            document.getElementById('display_name').textContent = profile.displayName;

            const profilePictureDiv = document.getElementById('profile_picture');
            if (profilePictureDiv.firstElementChild) {
                profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
            }
            const img = document.createElement('img');
            img.src = profile.pictureUrl;
            img.alt = 'Profile Picture';
            profilePictureDiv.appendChild(img);

            document.getElementById('status_message').textContent = profile.statusMessage;

            /* On scroll version */
            document.getElementById('profile_info_onscroll').classList.remove('hidden')
            document.getElementById('user_id_onscroll').textContent = profile.userId;
            document.getElementById('display_name_onscroll').textContent = profile.displayName;

            const profilePictureOnscrollDiv = document.getElementById('profile_picture_onscroll');
            if (profilePictureOnscrollDiv.firstElementChild) {
                profilePictureOnscrollDiv.removeChild(profilePictureOnscrollDiv.firstElementChild);
            }
            const imgOnScroll = document.createElement('img');
            imgOnScroll.src = profile.pictureUrl;
            imgOnScroll.alt = 'Profile Picture';
            profilePictureOnscrollDiv.appendChild(imgOnScroll);

            document.getElementById('status_message_onscroll').textContent = profile.statusMessage;
        }).catch(function(error) {
            window.alert('Error getting profile: ' + error);
        });
    } else {
        $('#btn_login').show();
        $('#btn_logout').hide();
    }
}

function registerButtonHandlers() {
    document.getElementById('btn_login').addEventListener('click', function() {
        if (!liff.isLoggedIn()) {
            liff.login();
            $('btn_login').hide();
            $('btn_logout').show();
        }
    });
 
    document.getElementById('btn_logout').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });
 
    /* Logout button onscroll version */
    document.getElementById('btn_logout_onscroll').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });
    
    // openWindow call
    document.getElementById('btn_review').addEventListener('click', function() {
        liff.openWindow({
            url: 'https://www.zomato.com/jakarta/',
            external: true
        });
    });

    document.getElementById('btn_scan_no').addEventListener('click', function() {
        if (!liff.isInClient()) {
            sendAlertIfNotInClient();
        } else {
            const scanQrResult = document.getElementById('scan_qr_result');
            const btnScanNo = document.getElementById('btn_scan_no');
            liff.scanCode().then(result => {
                const inputTableNo = document.getElementById('input_table_no');
                inputTableNo.value = result.value;
                inputTableNo.disabled = true;
                if (scanQrResult.offsetWidth <= 0 || scanQrResult.offsetHeight <= 0) {
                    scanQrResult.classList.remove('hidden');
                }
                btnScanNo.classList.add('hidden');
            }).catch(err => {
                document.getElementById('scan_error_text').textContent = "scanCode failed!";
                if (scanQrResult.offsetWidth <= 0 || scanQrResult.offsetHeight <= 0) {
                    scanQrResult.classList.add('hidden')
                    btnScanNo.classList.remove('hidden')
                }
            });
        }
    });
}

function sendAlertIfNotInClient() {
    alert('This button is unavailable as Contactless Dining is currently being opened in an external browser.');
}

async function getProfile() {
    var profileInfo = null;
    if (liff.isLoggedIn()) {
        await liff.getProfile().then(function(profile) {
            profileInfo = profile;
        }).catch(function(error) {
            showErrorAlert("Error getting profile");
        });
    }

    return profileInfo;
}
 
/**
* Toggle specified element
* @param {string} elementId The ID of the selected element
*/
function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.classList.add('hidden')
    } else {
        elem.classList.remove('hidden')
    }
}