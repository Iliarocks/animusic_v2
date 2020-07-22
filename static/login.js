const auth = firebase.auth();
let user;

window.onload = () => {
    if (window.action === 'sign in') {
        document.querySelector('#name-input').style.display = 'none';
    }
}

auth.onAuthStateChanged(currUser => {
    if (currUser) {
        user = currUser;
        window.location = window.origin;
    }
})

function sendVerification() {
    user.sendEmailVerification()
        .then(() => alert('We have sent a verification email to your inbox'))
        .catch(err => alert(err.message));
}

function login() {
    const name = document.querySelector('#name-input').value.split(' ').join('_');
    const email = document.querySelector('#email-input').value;
    const pass = document.querySelector('#password-input').value;
    if (window.action === 'sign up') {
        auth.createUserWithEmailAndPassword(email, pass)
            .then(result => {
                result.user.updateProfile({ displayName: name });
                sendVerification()
            })
            .catch(err => alert(err.message))
    } else if (window.action === 'sign in') {
        auth.signInWithEmailAndPassword(email, pass)
            .catch(err => alert(err.message))
    }
}
