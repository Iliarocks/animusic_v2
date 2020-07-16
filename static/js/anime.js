const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

//create error
function error(message) {
  errorText.innerText = message;
  document.querySelector('.error').style.right = '30px';
}

function signOut() {
  auth.signOut()
    .catch(err => error(err.message));
}

//listen user status
auth.onAuthStateChanged(user => {
  if (user) {
    document.querySelector('.signed-in-header').style.display = 'inline-block';
    document.querySelector('.signed-out-header').style.display = 'none';
  } else {
    document.querySelector('.signed-in-header').style.display = 'none';
    document.querySelector('.signed-out-header').style.display = 'inline-block';
  }
})

document.querySelector('header > div > h1').addEventListener('click', function() {
  window.location = window.origin;
})