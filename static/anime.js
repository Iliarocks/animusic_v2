const database = firebase.database();
const auth = firebase.auth();
var anime;

function loadAnime() {
  anime = window.anime;
  database.ref(`/anime/${anime}`).once('value', function(snap) {
    if (snap.val() === null) return;
    document.querySelector('.anime-info').innerHTML =
      `<img id="anime-cover" src="${snap.val().cover_src}" alt="">
      <h1 id="anime-en">${snap.val().en_name}</h1>
      <h2 id="anime-jap">${snap.val().jap_name}</h2>
      <p id="anime-likes">${snap.val().likes}</p>
      <button type="button" onclick="openPopup()"><i class="fad fa-plus-circle"></i></button>`
      if (snap.val().songs === undefined) return;
      loadSongs(Object.values(snap.val().songs))
  })
}

function search(query) {
  const results = animeNames.filter(name => {
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
  const query = event.target.value.toLowerCase();
  if (!animeNames) {
    animeNames = await database.ref('/anime').once('value').then(snap => {
      return Object.values(snap.val()).map(anime => anime.en_name.toLowerCase());
    })
    search(query)
  } else {
    search(query)
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
