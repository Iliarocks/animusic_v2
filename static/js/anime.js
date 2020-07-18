const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
var anime;

//create error
function error(message) {
  errorText.innerText = message;
  document.querySelector('.error').style.right = '30px';
}

function wikiEvent(url) {
  document.querySelector('#open-wiki').onclick = () => {
    window.location = url;
  }
}


function loadSongs() {
  database.ref(`/anime/${window.animeName}/songs`).once('value', snap => {
    if (snap.val() === null) return;
    let songs = Object.values(snap.val());
    console.log(songs)
    let newHTML = songs.reduce((html, song) => html + song.embeded, '');
    document.querySelector('.song-holder').innerHTML = newHTML;
  })
}
  
function loadInfo() {
  database.ref(`/anime/${anime}`).once('value', function(snap) {
    if (snap.val() === null) return;
    var animeObj = snap.val()
    document.querySelector('#cover-image').style.backgroundImage = `url(${animeObj.cover_src})`;
    document.querySelector('#en-name').innerText = animeObj.en_name;
    document.querySelector('#jap-name').innerText = animeObj.jap_name;
    wikiEvent(animeObj.wiki)
  })
}

async function addSong() {
  var url = document.querySelector('#spotify-input').value;
  if (url.split('/').indexOf('album') > 0) return;
  var embeded = `<iframe src="https://open.spotify.com/embed/track/${url.split('/')[url.split('/').length - 1].split('=')[0].split('?')[0]}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
  let exists = await songExists(embeded)
  if (exists.length > 0) {
    error('Hmm... seems like this song has already been added😁');
    return;
  }
  database.ref(`anime/${window.animeName}/songs`).push({ embeded })
  document.querySelector('.add-song-prompt').style.display = 'none';
  document.querySelector('#spotify-input').value = '';
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

//close error
closeErrorBtn.addEventListener('click', function(e) {
  document.querySelector('.error').style.right = '-360px';
})

document.querySelector('header > div > h1').addEventListener('click', function() {
  window.location = window.origin;
})
