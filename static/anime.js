const database = firebase.database();
const auth = firebase.auth();
var anime, animeNames;

auth.onAuthStateChanged(user => {
  if (user) {
    document.querySelectorAll('.signed-in').forEach(element => element.style.display = 'block');
  } else {
    switchNav()
    document.querySelectorAll('.signed-in').forEach(element => element.style.display = 'none'); 
  }
})

function switchNav() {
  document.querySelector('#account-item').innerHTML = `
  <a class="nav-link" href="/sign-up">
    <i class="fad fa-sign-in-alt"></i>
    <span class="link-text">Sign up</span>
  </a>`
}

database.ref(`/anime/${anime}/likes`).on('value', snap => {
  document.querySelector('#anime-likes').innerText = snap.val();
})

function likeEvent() {
  document.querySelector('#anime-likes').addEventListener('click', function() {
    database.ref(`/anime/${anime}/likes`).once('value', snap => {
      var currLikes = snap.val();
      database.ref(`/anime/${anime}`).update({ likes:currLikes + 1 })
    })
  })
}

function loadAnime() {
  anime = window.anime;
  database.ref(`/anime/${anime}`).once('value', function(snap) {
    if (snap.val() === null) return;
    document.querySelector('#anime-en').innerText = snap.val().en_name;
    document.querySelector('#anime-jap').innerText = snap.val().jap_name;
    document.querySelector('#anime-cover').src = snap.val().cover_src;
    likeEvent();
    if (snap.val().songs === undefined) return;
    loadSongs(Object.values(snap.val().songs));
  })
}

function search(names, query) {
  const results = names.filter(name => {
    return (name.indexOf(query) > -1 || query.indexOf(name) > -1);
  })
  const resultsHTML = results.reduce((html, result) => {
    return html + `<p>${result}</p>`;
  }, '');
  document.querySelector('.search-results').innerHTML = query === ''?'':resultsHTML;
}

function loadSongs(songs) {
  var songsHTML = songs.reduce((html, song) => {
    return html + `<li class="song-item">${song.embeded}</li>`;
  }, '');
  document.querySelector('.anime-song-list').innerHTML = songsHTML;
}

function addSong() {
  const spotifyURL = document.querySelector('#spotify-input').value;
  if (spotifyURL === '') {
    alert('Invalid URL')
    return;
  }
  const embededURL = `https://open.spotify.com/embed/track/${spotifyURL.split('/')[spotifyURL.split('/').length - 1].split('?')[0]}`;
  database.ref(`/anime/${anime}/songs`).push({embeded: `<iframe style="opacity:0;transition:600ms;" onload="fadeIn(event.target)" src="${embededURL}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`})
}

document.querySelector('#search').addEventListener('keyup', async function(event) {
  window.clearTimeout();
  const query = event.target.value.toLowerCase();
  if (!animeNames) {
    animeNames = await database.ref('/anime').once('value').then(snap => {
      return Object.values(snap.val()).map(anime => anime.en_name.toLowerCase());
    })
    window.setTimeout(() => search(animeNames, query), 400)
  } else {
    window.setTimeout(() => search(animeNames, query), 400)
  }
})

function fadeIn(element) {
  element.style.opacity = 1;
}

function openPopup() {
  document.querySelector('.popup').style.display = 'grid';
}

function closePopup() {
  document.querySelector('.popup').style.display = 'none';
}
