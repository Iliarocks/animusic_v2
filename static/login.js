const auth = firebase.auth();

window.onload = () => {
    if (window.action === 'sign in') {
        document.querySelector('#name-input').style.display = 'none';
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('logged in')
    } else {
        console.log('logged out')
    }
})

function login() {
    const name = document.querySelector('#name-input').value.split(' ').join('_');
    const email = document.querySelector('#email-input').value;
    const pass = document.querySelector('#password-input').value;
    if (window.action === 'sign up') {
        auth.createUserWithEmailAndPassword(email, pass)
            .then(result => result.user.updateProfile({ displayName: name }))
            .catch(err => console.log(err.message))
    } else if (window.action === 'sign in') {
        auth.signInWithEmailAndPassword(email, pass)
            .catch(err => console.log(err.message))
    }
}