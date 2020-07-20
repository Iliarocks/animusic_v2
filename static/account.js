const auth = firebase.auth();
const storage = firebase.storage();
let user;

// on auth state listener
auth.onAuthStateChanged(currUser => {
    if (currUser) {
        console.log('logged in')
        user = currUser;
    } else {
        console.log('logged out')
        user = '';
    }
})

function reAuth(action) {
    let pass = document.querySelector('#curr-pass1').value;
    if (action === 'pass') pass = document.querySelector('#curr-pass2').value;
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, pass);
    user.reauthenticateWithCredential(credential)
        .then(() => {
            if (action === 'email') changeEmail();
            if (action === 'pass') changePass();
        })
        .catch(err => alert(err.message))
}

//change user email
function changeEmail() {
    const newEmail = document.querySelector('#new-email').value;
    user.updateEmail(newEmail)
        .then(() => alert('your email has been updated'))
         .catch(err => alert(err.messgae))
}

//change user password
function changePass() {
    const newPass1 = document.querySelector('#new-pass1').value;
    const newPass2 = document.querySelector('#new-pass2').value;
    console.log(newPass1, newPass2)
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