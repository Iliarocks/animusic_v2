const db = firebase.database();
let animeToSearch;
let lastColor;

const error = message => {
    alert(message);
}

const loadAnime = () => {
    db.ref('/anime').once('value', snap => {
        const genres = ['popular', 'shonen', 'isekai']
        const animes = Object.values(snap.val()).sort((a, b) => b.likes - a.likes);
        genres.forEach((genre) => loadGenre(genre, animes));
    })
}

const getRandColor = () => {
    const colors = ['#A682FF', '#715AFF', '#5887FF', '#55C1FF', '#80ED99']
    const randNum = Math.floor(Math.random() * 5);
    const color = colors[randNum];
    return color;
}

const loadGenre = (genre, animes) => {
    const filteredAnimes = genre === 'popular'?animes.slice(0, 10):animes.filter(anime => anime.genre === genre).slice(0, 10);
    const animesHTML = filteredAnimes.reduce((html, anime) => {
        let randColor = getRandColor();
        while (randColor === lastColor) {
            randColor = getRandColor();
        }
        lastColor = randColor;
        return html + `<li class="anime-item" style="background:${randColor}">
            <a class="anime-link" href="/anime/${anime.en_name}">
                <h2 class="anime-name">${anime.en_name}</h2>
                <i class="fas fa-heart"></i>
                ${anime.likes}
            </a>
        </li>`
    }, '');
    document.querySelector('.anime').innerHTML += `<h1 class="genre-title">${genre}</h1><ul class="genre-list">${animesHTML}<span onclick="scrollRight(event.currentTarget )" class="see-more"><i class="far fa-angle-right"></i></span></ul>`;
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

const scrollToFirstAnime = (element) => {
    const sliderTimer = setInterval(() => {
        element.scrollLeft -= 10;
        if (element.scrollLeft <= 0) window.clearInterval(sliderTimer);
    }, 10)
}

const scrollRight = (div) => {
    scrollAmount = 0;
    if (div.parentElement.scrollWidth - div.parentElement.scrollLeft === div.parentElement.clientWidth) {
        scrollToFirstAnime(div.parentElement)
        return
    };
    const sliderTimer = setInterval(() => {
        div.parentElement.scrollLeft += 10;
        scrollAmount += 10;
        if (scrollAmount >= 448) window.clearInterval(sliderTimer);
    }, 20)
}

window.addEventListener('load', loadAnime)

document.querySelector('#add-anime').addEventListener('click', event => {
    const enName = document.querySelector('#en-name').value.toLowerCase();
    const japName = document.querySelector('#jap-name').value.toLowerCase();
    const genre = document.querySelector('#genre-select').value;
    if (!enName || !japName || genre === 'genre') {
        error('something is missing');
        return;
    }
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