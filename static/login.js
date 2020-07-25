const auth = firebase.auth();
let user;

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
    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;
    if (window.action === 'sign up') {
        const name = document.querySelector('#username').value;
        if (name === '') { alert('name is missing'); return; }
        auth.createUserWithEmailAndPassword(email, pass)
            .then(result => {
                result.user.updateProfile({ displayName: name });
            })
            .catch(err => alert(err.message))
    } else if (window.action === 'sign in') {
        auth.signInWithEmailAndPassword(email, pass)
            .catch(err => alert(err.message))
    }
}
