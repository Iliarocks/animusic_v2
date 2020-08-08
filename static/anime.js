const db = firebase.database();
const anime = window.anime;
let animeToSearch;

const addSong = () => {
    const songURL = document.querySelector('#spotify-input').value;
    if (!songURL) return;
    const embedded = `<iframe src="https://open.spotify.com/embed/track/${songURL.split('/')[songURL.split('/').length - 1].split('?')[0]}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
    db.ref(`/anime/${anime}/songs`).push({ embedded });
}

const loadSongs = () => {
    db.ref(`/anime/${anime}/songs`).once('value', snap => {
        if (!snap.val()) return;
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
        return html + `<li class="search-item">${result}</li>`;
    }, '')
    document.querySelector('#search-results').innerHTML = !query ? '':resultsHTML;
}

document.querySelector('#add-song').addEventListener('click', addSong);
window.addEventListener('load', loadPage);

document.querySelector('#search').addEventListener('keyup', async event => {
    const query = event.target.value.toLowerCase();
    if (!animeToSearch) animeToSearch = await db.ref('/anime').once('value').then(snap => {
        return Object.values(snap.val()).map(anime => anime.en_name).sort((a, b) => b.likes - a.likes);
    });
    search(query, animeToSearch)
})

