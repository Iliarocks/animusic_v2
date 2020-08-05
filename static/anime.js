const database = firebase.database();
const auth = firebase.auth();
var anime, animeNames;

auth.onAuthStateChanged(user => {
  if (!user) switchNav();
})

function switchNav() {
  document.querySelector('#account-item').innerHTML = `
  <a class="nav-link" href="/sign-up">
    <i class="fad fa-sign-in-alt"></i>
    <span class="link-text">Sign up</span>
  </a>`
}

database.ref(`/anime/${anime}/likes`).on('value', function(snap) {
  document.querySelector('#anime-likes').innerText = snap.val();
})

database.ref(`/anime/${anime}/comments`).on('value', function(snap) {
  if (!snap.val()) return;
  loadComments(Object.values(snap.val()));
})

function loadAnime(animeRef) {
  anime = animeRef
  database.ref(`/anime/${anime}`).once('value', function(snap) {
    var animeObj = snap.val();
    document.querySelector('.anime-info').style.backgroundImage = `url(${animeObj.cover_src})`;
    document.querySelector('#anime-en').innerText = animeObj.en_name;
    document.querySelector('#anime-jap').innerText = animeObj.jap_name;
    document.querySelector('#anime-genre').innerText = animeObj.genre;
    if (animeObj.songs === undefined) return;
    loadSongs(Object.values(animeObj.songs));
  })
}



function loadComments(comments) {
  if (!comments) return;
  const yourComments = comments.filter(comment => comment.commenter_id === auth.currentUser.uid);
  const allComments = comments.filter(comment => comment.commenter_id !== auth.currentUser.uid).sort((a, b) => b.upvotes - a.upvotes);
  const yourCommentsHTML = yourComments.reduce((html, comment) => html + `<li class="comment"> | ${comment.commenter_name} | ${comment.comment} | ${comment.upvotes}</li>`, '');
  const allCommentsHTML = allComments.reduce((html, comment) => html + `<li class="comment">${comment.commenter_name} | ${comment.comment} | ${comment.upvotes}</li>`, '')
  document.querySelector('.comment-holder').innerHTML = yourCommentsHTML + allCommentsHTML;
}

function loadSongs(songs) {
  const songHTML = songs.reduce((html, song) => html + `<li class="song" style="width:300px;heigh:380px;">${song.embeded}</li>`, '')
  document.querySelector('.song-holder').innerHTML = songHTML;
}

function addComment(comment) {
  database.ref(`/anime/${anime}/comments`).push({ comment, upvotes: 0, commenter_id: auth.currentUser.uid, commenter_name: auth.currentUser.displayName}).catch(err => alert(err));
}

function search(names, query) {
  const results = names.filter(name => {
    return (name.indexOf(query) > -1 || query.indexOf(name) > -1);
  })
  const resultsHTML = results.reduce((html, result) => {
    return html + `<li class="search-item"><a href="/anime/${result.split(' ').join('-')}">${result}</a></li>`;
  }, '');
  document.querySelector('.search-results').innerHTML = query === ''?'':`<ul class="search-list">${resultsHTML}</ul>`;
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
    animeNames = await database.ref('/anime').once('value').then(snap => Object.values(snap.val()).map(anime => anime.en_name.toLowerCase()))
    window.setTimeout(() => search(animeNames, query), 400)
  } else {
    window.setTimeout(() => search(animeNames, query), 400)
  }
})

document.querySelector('#like-button').addEventListener('click', function(event) {
  database.ref(`/anime/${anime}/likes`).once('value', snap => {
    const currLikes = snap.val();
    database.ref(`/anime/${anime}`).update({ likes: currLikes + 1})
  })
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

document.querySelector('#add-comment').addEventListener('click', function(event) {
  const comment = document.querySelector('#comment-input').value;
  if (!comment) {
    alert("Comment can't be empty");
    return
  } else if (!auth.currentUser) {
    alert('You have to sign in to comment');
    return;
  }
  addComment(comment)
})