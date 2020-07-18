const database = firebase.database();
const auth = firebase.auth();
const nameIn = document.querySelector('#name-input');
const emailIn = document.querySelector('#email-input');
const passIn = document.querySelector('#password-input');
const actionBtn = document.querySelector('#action-btn');
const linkBtn = document.querySelector('#link');
const headerTitle = document.querySelector('header > h1');
const closeErrorBtn = document.querySelector('#close-error');
const errorText = document.querySelector('.error > p');

auth.onAuthStateChanged(user => {
  if (user) window.location = window.origin;
})

if (window.action === 'Sign in') document.querySelector('#name-input').style.display = 'none';

//create error
function error(message) {
  errorText.innerText = message;
  document.querySelector('.error').style.right = '30px';
}

function nameExists(username) {
  if (username === '') return;
  return database.ref('/usernames').once('value').then(async function(snap) {
    var exists = await Object.values(snap.val()).filter(name => name === username);
    if (exists.length > 0) {
      nameIn.style.borderBottom = '3px solid #e83333';
      return true;
    }
    nameIn.style.borderBottom = '3px solid #42e833';
    return false;
  })
}

//sign user up
async function signUp() {
  var username = nameIn.value.toLowerCase();
  var email = emailIn.value;
  var pass = passIn.value;
  var exists = await nameExists(username);
  if (exists || username === '') {error('Hmm... seems like the name is unavailable or badly formatted'); return;};
  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => {
      database.ref(`users/${auth.currentUser.uid}`).set({ username, uid: auth.currentUser.uid})
      database.ref(`/usernames`).update({ [auth.currentUser.uid]: username })
    })
    .catch(err => error(err.message))
}

//sign user in
function signIn() {
  var email = emailIn.value;
  var pass = passIn.value;
  auth.signInWithEmailAndPassword(email, pass)
  .catch(err => {
    error(err.message);
    return;
  })
}

nameIn.addEventListener('input', function(e) {
  nameExists(e.target.value.toLowerCase())
})

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

//close error
closeErrorBtn.addEventListener('click', function(e) {
  document.querySelector('.error').style.right = '-360px';
})
