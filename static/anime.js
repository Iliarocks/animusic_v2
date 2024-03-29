const db = firebase.database();
const anime = window.anime;
let animeToSearch;

const error = message => {
    alert(message);
}

const addSong = () => {
    const songURL = document.querySelector('#spotify-input').value;
    if (!songURL) {
        error("Make sure you've inserted a stoptify link before pressing the add button.");
        return
    }
    const embedded = `<iframe src="https://open.spotify.com/embed/track/${songURL.split('/')[songURL.split('/').length - 1].split('?')[0]}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
    db.ref(`/anime/${anime}/songs`).push({ embedded });
}

const loadSongs = () => {
    db.ref(`/anime/${anime}/songs`).once('value', snap => {
        if (!snap.val()) {
            error('It appears that no songs have been added to this page yet.');
            return;
        }
        const songs = Object.values(snap.val());
        const songsHTML = songs.reduce((html, song) => html + song.embedded, '');
        document.querySelector('.songs').innerHTML = songsHTML;
    })
}

const loadPage = () => {
    loadSongs();
}

const search = (query, animes) => {
    const results = animes.filter(name => {
        return name.indexOf(query) > -1 || query.indexOf(name) > -1;
    });
    const resultsHTML = results.reduce((html, result) => {
        return html + `<li class="search-item"><a class="search-link" href="/anime/${result}">${result}</a></li>`;
    }, '')
    document.querySelector('#search-results').innerHTML = !query ? '':resultsHTML;
}

const like = () => {
    db.ref(`/anime/${anime}/likes`).once('value', snap => {
        var newLikes = snap.val() + 1;
        db.ref(`/anime/${anime}`).update({ likes: newLikes });
    })
}

db.ref(`/anime/${anime}/likes`).on('value', snap => {
    document.querySelector('#curr-likes').innerText = snap.val();
})

document.querySelector('#add-song').addEventListener('click', addSong);

window.addEventListener('load', loadPage);

document.querySelector('#like-anime').addEventListener('click', like)

document.querySelector('#search').addEventListener('keyup', async event => {
    const query = event.target.value.toLowerCase();
    if (!animeToSearch) animeToSearch = await db.ref('/anime').once('value').then(snap => {
        return Object.values(snap.val()).map(anime => anime.en_name).sort((a, b) => b.likes - a.likes);
    });
    window.clearTimeout()
    window.setTimeout(() => search(query, animeToSearch), 400)
})

