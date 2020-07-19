const auth = firebase.auth();
const database = firebase.database();
const storage = firebase.storage();
var username, uid, email;

auth.onAuthStateChanged(user => {
    if (user) {
        username = user.displayName;
        uid = user.uid;
        email = user.email;
        document.querySelector('.signed-out').style.display = 'none';
        document.querySelectorAll('.signed-in').forEach(element => element.style.display = 'list-item');
    } else {
        document.querySelector('.signed-out').style.display = 'block';
        document.querySelectorAll('.signed-in').forEach(element => element.style.display = 'none');
    }
});

//search anime on keypress
function search(query) {
    database.ref('/anime').once('value', function(snap) {
        var animes = Object.keys(snap.val());
        var queryLetters = query.split('-');
        var searchHTML = '';
        animes.forEach((anime, i) => {
            if (i >= queryLetters.length) return;
            if (anime.includes(queryLetters[i])) searchHTML += anime;
            if (query === '') searchHTML = '';
        })
        document.querySelector('.search-results').innerHTML = searchHTML;
    })
};

async function loadGenre(anime, genre) {
    var genreArr = await genre === 'popular' ? anime.slice(0, 6):anime.filter(anime => anime.genre === genre).slice(0, 6);
    var genreHTML = genreArr.reduce((html, anime) => {
        return html + 
        `<div id="${anime.en_name}">
            <p>${anime.en_name} | ${anime.jap_name} | ${anime.genre} | ${anime.likes}</p>
            <img style="opacity:0;transition:250ms;" onload="fadeIn(this)" src="${anime.cover_src}">
        </div>`
    }, '')
    document.querySelector('main').innerHTML += `<a href="http://localhost:5000/genre/${genre}">${genre}</a><div class="${genre}">${genreHTML}</div>`;
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

async function addSong() {
    var en = document.querySelector('#en-input').value.toLowerCase();
    var jap = document.querySelector('#jap-input').value.toLowerCase();
    var cover = document.querySelector('#cover-input').files[0];
    var genre = document.querySelector('#genre-select').value;
    var storageRef = `covers/${cover.name}`;
    var task = await storage.ref(storageRef).put(cover);
    var coverSrc = await getImgURL(storageRef);
    database.ref(`/anime/${en}`).set({
        en_name: en,
        jap_name: jap,
        cover_src: coverSrc,
        genre: genre,
        likes: 0
    })
    closePopup()
    imageEvent()
};

function signOut() {
    auth.signOut()
};

function openPopup() {
    document.querySelector('.popup').style.display = 'flex';
};

function closePopup() {
    document.querySelector('.popup').style.display = 'none';
};

function clickInput() {
    document.querySelector('#cover-input').click();
};

function fadeIn(element) {
    element.style.opacity = '1';
}