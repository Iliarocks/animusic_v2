const auth = firebase.auth();
const storage = firebase.storage();
let user;

// on auth state listener
auth.onAuthStateChanged(currUser => {
    if (currUser) {
        console.log('logged in')
        user = currUser;
        loadProfile();
    } else {
        console.log('logged out')
        user = '';
        window.location = window.origin;
    }
})

function loadProfile() {
    const profileURL = user.photoURL;
    const name = user.displayName;
    if (!profileURL || !name) return;
    document.querySelector('#profile-pic-item').innerHTML = `
        <a onclick="clickInput()">
            <img onload="fadeIn(event.target)" src="${profileURL}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;opacity:0;transition:300ms;">
            <span class="item-text">${name}</span>
            <input accept="image/x-png, image/jpeg" onchange="changeProfilePic()" type="file" id="profile-pic-input" hidden>
         </a>
    `
}

function reAuth(action) {
    let pass = document.querySelector('#curr-pass1').value;
    if (action === 'pass') pass = document.querySelector('#curr-pass2').value;
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, pass);
    user.reauthenticateWithCredential(credential)
        .then(() => {
            if (action === 'email') changeEmail();
            if (action === 'pass') changePass();
        })
        .catch(err => alert(err.message));
}

function sendVerificationEmail() {
    user.sendEmailVerification()
        .then(() => alert('A verification email has been sent to your inbox'))
        .catch(err => alert(err.message));
}

function sendPassVerification() {
    auth.sendPasswordResetEmail(user.email)
        .then(() => alert('A password reset email has been sent to your inbox'))
        .catch(err => alert(err.message));
}  

async function changeProfilePic() {
    const pic = document.querySelector('#profile-pic-input').files[0];
    const task = await storage.ref(`/profiles/${pic.name}`).put(pic);
    const photoURL = await storage.ref(`/profiles/${pic.name}`).getDownloadURL().then(url => url);
    user.updateProfile({ photoURL })
        .then(() => alert('Refresh to see changes'))
        .catch(err => alert(err.message));
}

//change username
function changeName() {
    const displayName = document.querySelector('#new-name').value;
    if (displayName.length < 6 || displayName === '') {
        alert('The name is either invalid or too short');
        return;
    }
    user.updateProfile({ displayName })
        .then(() => alert(`Your name has been updated to ${displayName}`))
        .catch(err => alert(err.message));
}

//change user email
function changeEmail() {
    const newEmail = document.querySelector('#new-email').value;
    user.updateEmail(newEmail)
        .then(() => sendVerificationEmail())
        .catch(err => alert(err.message));
}

//change user password
function changePass() {
    const newPass1 = document.querySelector('#new-pass1').value;
    const newPass2 = document.querySelector('#new-pass2').value;
    if (newPass1 !== newPass2) {
        alert('Passwords do not match');
        return;
    }
    user.updatePassword(newPass1)
        .then(() => alert('your password has been changed'))
        .catch(err => alert(err.message));  
}

//click profile input
function clickInput() {
    document.querySelector('#profile-pic-input').click();
}
 
//sign out firebase user
function signOut() {
    auth.signOut()
        .catch(err => alert(err));
};

function fadeIn(element) {
    element.style.opacity = '1';
}