const addressBarContent = new URLSearchParams(location.search);
const artistId = addressBarContent.get('artistId');

const getArtistData = function () {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok ' + response.statusText);
            }
        })
        .then((artist) => {
            const artisti = document.querySelectorAll(".titolo");
            artisti.forEach((artista) => {
                artista.innerText = artist.name;
            });
            const imgArtista = document.getElementById("artistImg");
            imgArtista.setAttribute("src", artist.picture);
            const bgArtist = document.getElementById("firstPart");
            bgArtist.setAttribute("style", `background-image: url(${artist.picture_xl});`);
            getArtistInfo(); // Spostato qui per assicurarsi che le informazioni dell'artista siano caricate
        })
        .catch((err) => {
            console.log('ERRORE!', err);
            alert(`An error occurred: ${err.message}`);
        });
};

const getArtistInfo = function() {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=50`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok ' + response.statusText);
            }
        })
        .then((song) => {
            let canzoni = song.data.slice(0, 5);
            const divPopolari = document.getElementById("popolari");
            divPopolari.innerHTML = ""; // Svuota il div per evitare duplicati
            canzoni.forEach((canzone, i) => {
                const durataInMinuti = Math.floor(canzone.duration / 60);
                const durataSecondi = canzone.duration % 60;
                const durataFormattata = `${durataInMinuti}:${durataSecondi.toString().padStart(2, '0')}`;
                const newdiv = document.createElement("div");
                newdiv.innerHTML = `
                    <div class="row align-items-center px-3 song-item">
                        <div class="col-7 d-flex mt-3 align-items-center">
                            <h6 class="grey-text me-4">${i + 1}</h6>
                            <img src="${canzone.album.cover}" class="me-4" height="35px" alt="img">
                            <h6 class="text-light song-title pointer">${canzone.title_short}</h6>
                        </div>
                        <div class="col-4">
                            <h6 class="grey-text">100.000.000</h6>
                        </div>
                        <div class="col-1">
                            <h6 class="grey-text">${durataFormattata}</h6>
                        </div>
                    </div>`;
                divPopolari.appendChild(newdiv);

                // Aggiungi event listener al titolo della canzone
                newdiv.querySelector('.song-title').addEventListener('click', () => {
                    updateSongInfo(canzone);
                });
            });
        })
        .catch((err) => {
            console.log('ERRORE!', err);
            alert(`An error occurred: ${err.message}`);
        });
};

function updateSongInfo(canzone) {
    const songInfos = document.querySelector('.song-infos');
    songInfos.innerHTML = `
        <div class="image-container">
            <img src="${canzone.album.cover}" alt="album cover" />
        </div>
        <div class="song-description pointer">
            <p class="title">${canzone.title_short}</p>
            <p class="artist">${canzone.artist.name}</p>
        </div>
    `;
}

// Inizia la chiamata API
getArtistData();
