const database = firebase.database();
const auth = firebase.auth();
const nameIn = document.querySelector('#name-input');
const emailIn = document.querySelector('#email-input');
const passIn = document.querySelector('#password-input');
const actionBtn = document.querySelector('#action-btn');
const linkBtn = document.querySelector('#link');
const headerTitle = document.querySelector('header > h1');

auth.onAuthStateChanged(user => {
  if (user) window.location = window.origin;
})

if (window.action === 'Sign in') document.querySelector('#name-input').style.display = 'none';

//sign user up
function signUp() {
  var name = nameIn.value;
  var email = emailIn.value;
  var pass = passIn.value;
  if (name === '' || email === '' || pass === '') return;
  auth.createUserWithEmailAndPassword(email, pass)
    .catch(err => alert(err.message))
    .then(() => database.ref(`users/${auth.currentUser.uid}`).set({ full_name: name }))
}

//sign user in
function signIn() {
  var email = emailIn.value;
  var pass = passIn.value;
  if (email === '' || pass === '') return;
  auth.signInWithEmailAndPassword(email, pass)
    .catch(err => alert(err.message))
}

//listen for click to either log user in or sign user up
actionBtn.addEventListener('click', function(e) {
  if (window.action === 'Sign up') signUp();
  if (window.action === 'Sign in') signIn();
})

//listen for click to change action
linkBtn.addEventListener('click', function(e) {
  window.location = `${window.origin}${window.new_path}`;
  // var httpRequest = new XMLHttpRequest();
  // httpRequest.open('GET', `${window.origin}${window.new_path}`, true)
  // // httpRequest.onload = function() {
  // //   var newAction = window.link;
  // //   var newPath = window.action.toLowerCase().split(' ').join('-');
  // //   window.action = newAction;
  // //   window.new_path = newPath;
  // //   document.body.innerHTML = httpRequest.responseText.split('body>')[1]
  // // }
  // // httpRequest.send()
})

//go home
headerTitle.addEventListener('click', function(e) {
  window.location = window.origin;
})
