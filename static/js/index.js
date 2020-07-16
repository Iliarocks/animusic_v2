const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();
const closeCreateBtn = document.querySelector('#close-create');
const openCreateBtn = document.querySelector('#open-create');
const createBtn = document.querySelector('#create');
const enNameIn = document.querySelector('#en-name-input');
const japNameIn = document.querySelector('#jap-name-input');
const wikiIn = document.querySelector('#wiki-input');
const coverIn = document.querySelector('#cover-input');
const genreIn = document.querySelector('#genre-select');
const closeErrorBtn = document.querySelector('#close-error');
const errorText = document.querySelector('.error > p');

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

function simplifyNum() {

}

function openAnimeEvent() {
  document.querySelectorAll('.anime-box').forEach(anime => {
    anime.addEventListener('click', function(e) {
      window.location = `${window.origin}/anime/${e.target.id}`;
    })
  })
}

async function loadGenre(arr, genre) {
  var genreArr = await genre === 'popular' ? arr.slice(0, 6) : arr.filter(anime => anime.genre === genre).slice(0, 5);
  var genreHTML = genreArr.reduce((html, anime) => {
    return html + `
    <div id="${anime.en_name.split(' ').join('-')}" class="anime-box" style="background-image: url(${anime.cover_src})">
      <h1 class="en-title anime-text">${anime.en_name}</h1>
      <h2 class="jap-title anime-text">${anime.jap_name}</h2>
      <div class="likes-div">
        <i style="display:inline-block" class="fas fa-heart"></i>
        <h2 style="display:inline-block" class="anime-likes">${anime.likes}</h2>
      </div>
    </div>`;
  }, '')
  document.querySelector(`.${genre}`).innerHTML = genreHTML;
  openAnimeEvent();
}

function loadAnime() {
  database.ref('/anime').once('value', function(snap) {
    var anime = Object.values(snap.val()).sort((a, b) => b.likes - a.likes).slice(0, 250);
    var genres = ['popular', 'shonen', 'isekai'];
    genres.forEach(genre => loadGenre(anime, genre));
  })
}

//check if path exists
function pathExists(path) {
  return database.ref(path).once('value').then(function(snap) {
    if (snap.val() === null) return false;
    return true;
  })
}

//get url from storage
function getImgURL(ref) {
  return storage.ref(ref).getDownloadURL().then(url => {
    return url;
  });
}

//create a page
async function create() {
  var enName = enNameIn.value.toLowerCase();
  var japName = japNameIn.value.toLowerCase();
  var genre = genreIn.value.toLowerCase();
  var wiki = wikiIn.value;
  var cover = coverIn.files[0];
  var exists = await pathExists(`/anime/${enName.split(' ').join('-')}`);
  if (enName === '' || japName === '' || wiki === '' || cover === '') {
    error('Hmm... Seems like somethings missing.');
    return;
  } else if (exists) {
    error('Hmm... Seems like this anime already exists.');
    return;
  }
  var imgURL = await storage.ref(`/covers/${cover.name}`).put(cover).then(() => getImgURL(`/covers/${cover.name}`));
  database.ref(`anime/${enName.split(' ').join('-')}`).set({ en_name: enName, jap_name: japName, cover_src: imgURL, likes: 0, genre, wiki });
  document.body.style.overflowY = 'scroll';
  document.querySelector('.create-prompt').style.display = 'none';
}

//open create prompt
openCreateBtn.addEventListener('click', function(e) {
  document.body.style.overflowY = 'hidden';
  document.querySelector('.create-prompt').style.height = '100vh';
})

//close create prompt
closeCreateBtn.addEventListener('click', function(e) {
  document.body.style.overflowY = 'scroll';
  document.querySelector('.create-prompt').style.height = '0';
})

//close create prompt 2
document.querySelector('.create-prompt').addEventListener('click', function(e) {
  if (e.target !== this) return;
  document.body.style.overflowY = 'scroll';
  e.target.style.height = '0';
})

//close error
closeErrorBtn.addEventListener('click', function(e) {
  document.querySelector('.error').style.right = '-360px';
})

//go sign up
document.querySelector('#sign-up').addEventListener('click', function(e) {
  window.location = window.origin + '/sign-up'
})