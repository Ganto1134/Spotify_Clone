document.getElementById('search-input').addEventListener('input', () => {
    const searchValue = document.getElementById('search-input').value.trim();
    const url = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=' + encodeURIComponent(searchValue);

    const predefinedCards = document.getElementById('predefined-cards');
    const searchResults = document.getElementById('search-results');

    // Mostra la div delle cards predefinite se il campo di ricerca è vuoto
    if (searchValue === '') {
        predefinedCards.style.display = 'flex';  // Usa 'flex' per ripristinare il layout a griglia
        searchResults.innerHTML = ''; // Svuota i risultati di ricerca
        return;
    } else {
        predefinedCards.style.display = 'none';
    }

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

            searchResults.innerHTML = '';

            canzone.forEach(song => {
                const card = document.createElement('div');
                card.className = 'col-6 col-md-4 col-lg-3 mb-3';
                card.innerHTML = `
                    <div class="card bg-dark text-light p-2">
                    <a class="text-white" href="album.html?albumtId=${song.album.id}">
                        <img src="${song.album.cover_medium}" class="card-img-top" alt="Cover di ${song.title}"></a>
                        <div class="card-body">
                            <h5 class="card-title">${song.title_short}</h5>
                            <a class="text-white" href="artist.html?artistId=${song.artist.id}">
                            <p class="card-text">${song.artist.name}</p></a>
                        </div>
                    </div>
                `;
                searchResults.appendChild(card);
            });
        })
        .catch(error => console.log('Errore:', error));
});
