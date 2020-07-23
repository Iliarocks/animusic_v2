const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();
var username, uid, email, photoURL, animeNames;

auth.onAuthStateChanged(user => {
    if (user) {
        username = user.displayName;
        uid = user.uid;
        email = user.email;
        photoURL = user.photoURL;
    } else {
      switchNav()
    }
});

function search(names, query) {
  const results = names.filter(name => {
    return (name.indexOf(query) > -1 || query.indexOf(name) > -1);
  })
  const resultsHTML = results.reduce((html, result) => {
    return html + `<p>${result}</p>`;
  }, '');
  document.querySelector('.search-results').innerHTML = query === ''?'':resultsHTML;
}

function switchNav() {
  document.querySelector('#account-item').innerHTML = `
  <a class="nav-link" href="/sign-up">
    <i class="fad fa-sign-in-alt"></i>
    <span class="link-text">Sign up</span>
  </a>`
}

async function loadGenre(anime, genre) {
    var genreArr = await genre === 'popular' ? anime.slice(0, 6):anime.filter(anime => anime.genre === genre).slice(0, 6);
    var genreHTML = await genreArr.reduce((html, anime) => {
        return html +
        `<li class="anime-item">
          <a class="anime-link" href="/anime/${anime.en_name.split(' ').join('-')}">
            <h1 class="anime-en">${anime.en_name}</h1>
            <h2 class="anime-jap">${anime.jap_name}</h2>
            <i class="fad fa-heart-circle"></i>
            <span class="anime-likes">${anime.likes}</span>
            <img class="anime-image" src="${anime.cover_src}">
          </a>
        </li>`
    }, '')
    document.querySelector('main').innerHTML += `
    <a class="genre-link" href="/genre/${genre}">${genre}</a>
    <div class="genre-holder">
      <ul class="anime-list">
        ${genreHTML}
      </ul>
    </div>
    `
};

function loadAnime() {
    database.ref('/anime').once('value', function(snap) {
        var anime = Object.values(snap.val()).sort((a, b) => b.likes - a.likes).slice(0, 250);
        var genres = ['popular', 'shonen'];
        genres.forEach(genre => loadGenre(anime, genre))
    })
};

function getImgURL(ref) {
   return storage.ref(ref).getDownloadURL().then(url => url);
};

async function addAnime() {
    var en = document.querySelector('#en-input').value.toLowerCase();
    var jap = document.querySelector('#jap-input').value.toLowerCase();
    var cover = document.querySelector('#cover-input').files[0];
    var genre = document.querySelector('#genre-select').value;
    if (en === '' || jap === '' || cover === undefined || genre === '') {
        alert('Hmm... Somethings missing.')
        return;
    }
    var storageRef = `covers/${cover.name}`;
    var task = await storage.ref(storageRef).put(cover);
    var coverSrc = await getImgURL(storageRef);
    database.ref(`/anime/${en.split(' ').join('-')}`).set({
        en_name: en,
        jap_name: jap,
        cover_src: coverSrc,
        genre: genre,
        likes: 0
    })
    closePopup()
    imageEvent()
};

function openPopup() {
    if (auth.currentUser === null) {
      alert('Sign in to add anime');
      return;
    }
    document.querySelector('.popup').style.display = 'grid';
};

document.querySelector('#search').addEventListener('keyup', async function(event) {
  window.clearTimeout();
  const query = event.target.value.toLowerCase();
  if (!animeNames) {
    animeNames = await database.ref('/anime').once('value').then(snap => {
      return Object.values(snap.val()).map(anime => anime.en_name.toLowerCase());
    })
    window.setTimeout(() => {
      search(animeNames, query)
    }, 400)
  } else {
    window.setTimeout(() => {
      search(animeNames, query)
    }, 400)
  }
})

function closePopup() {
    document.querySelector('.popup').style.display = 'none';
};

function clickInput() {
    document.querySelector('#cover-input').click();
};

function fadeIn(element) {
    element.style.opacity = '1';
}
