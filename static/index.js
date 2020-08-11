const db = firebase.database();
let animeToSearch;

const loadAnime = () => {
    db.ref('/anime').once('value', snap => {
        const genres = ['popular', 'shonen']
        const animes = Object.values(snap.val());
        genres.forEach((genre) => loadGenre(genre, animes))
    })
}

const loadGenre = (genre, animes) => {
    const filteredAnimes = genre === 'popular'?animes.sort((a, b) => b.likes - a.likes).slice(0, 6):animes.filter(anime => anime.genre === genre).slice(0, 6);
    const animesHTML = filteredAnimes.reduce((html, anime) => {
        return html + `<li class="anime-item"><a class="anime-link" href="/anime/${anime.en_name}">${anime.en_name}</a></li>`
    }, '');
    document.querySelector('.anime').innerHTML += `<h1 class="genre-title">${genre}</h1><ul>${animesHTML}</ul>`;
}

const addAnime = (enName, japName, genre) => {
    db.ref(`/anime/${enName}`).set({
        en_name: enName,
        jap_name: japName,
        genre: genre,
        likes: 0
    }).catch(err => alert(err));
}

const search = (query, animes) => {
    const results = animes.filter(name => {
        return name.indexOf(query) > -1 || query.indexOf(name) > -1;
    })
    const resultsHTML = results.reduce((html, result) => {
        return html + `<li class="search-item"><a class="search-link" href="/anime/${result}">${result}</a></li>`;
    }, '')
    document.querySelector('#search-results').innerHTML = !query? '':resultsHTML;
}

window.addEventListener('load', loadAnime)

document.querySelector('#add-anime').addEventListener('click', event => {
    const enName = document.querySelector('#en-name').value.toLowerCase();
    const japName = document.querySelector('#jap-name').value.toLowerCase();
    const genre = document.querySelector('#genre-select').value;
    if (!enName || !japName || genre === 'genre') return;
    addAnime(enName, japName, genre);
})

document.querySelector('#search').addEventListener('keyup', async event => {
    const query = event.target.value.toLowerCase();
    if (!animeToSearch) animeToSearch = await db.ref('/anime').once('value').then(snap => {
        return Object.values(snap.val()).map(anime => anime.en_name).sort((a, b) => b.likes - a.likes);
    });
    window.clearTimeout();
    window.setTimeout(() => search(query, animeToSearch), 400);
})