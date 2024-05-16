let cards = document.querySelectorAll('.carta');
let titles = document.querySelectorAll('.titolo');
let par = document.querySelectorAll('.par'); // Supponendo che questi siano i paragrafi
let a = document.querySelectorAll('#overflow a');
let artista = document.querySelectorAll('.carta .card-body a');
let albumCentro = document.querySelectorAll('.albumino');
let albumSx = document.querySelectorAll('.albumSx');

// let url = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=album%20pop';

document.addEventListener('DOMContentLoaded', function() {
    const nascondiBtn = document.getElementById('nascondi');
    const mainCard = document.getElementById('mainCard');

    nascondiBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Previene il comportamento predefinito del link

        mainCard.classList.toggle('d-md-block');
        if (mainCard.classList.contains('d-md-block')) {
            nascondiBtn.textContent = 'NASCONDI ANNUNCI';
        } else {
            nascondiBtn.textContent = 'MOSTRA ANNUNCI';
        }
    });

    // Aggiungi l'event listener per il pulsante di ricerca
    const searchButton = document.getElementById('search-button');
    const mainPage = document.getElementById('mainpage');
    const cercaMobile = document.getElementById('cerca-mobile');

    searchButton.addEventListener('click', function() {
        mainPage.classList.toggle('d-none');
        cercaMobile.classList.toggle('d-none');
        cercaMobile.classList.toggle('d-block');
    });
});

document.getElementById('search-input').addEventListener('input', () => {
    const searchValue = document.getElementById('search-input').value.trim();
    const url = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=' + encodeURIComponent(searchValue);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((datoCanzone) => {
            console.log(datoCanzone);
            let canzone = datoCanzone.data;
            console.log(canzone);

            for (let i = 0; i < cards.length; i++) {
                titles[i].innerHTML = canzone[i].title_short; // Uso del titolo della canzone
                par[i].innerHTML = canzone[i].artist.name; // Uso del nome dell'artista
                a[i].innerHTML = canzone[i].title_short;
                // Aggiungere la copertina dell'album
                let img = cards[i].querySelector('.album');
                if (img) {
                    img.src = canzone[i].album.cover_xl;
                    img.alt = `Cover di ${canzone[i].title}`;
                }
                if (artista[i]) {
                    artista[i].href = `artist.html?artistId=${canzone[i].artist.id}`;
                }
                if (albumCentro[i]) {
                    albumCentro[i].href = `album.html?albumtId=${canzone[i].album.id}`;
                }
                if (albumSx[i]) {
                    albumSx[i].href = `album.html?albumtId=${canzone[i].album.id}`;
                }
            }
        })
        .catch(error => console.log('Non va e mo è pure colpa tua', error));
});
