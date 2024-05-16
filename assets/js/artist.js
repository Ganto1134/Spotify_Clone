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
            let canzoni = song.data.slice(0, 8);
            const divPopolari = document.getElementById("popolari");
            divPopolari.innerHTML = ""; // Svuota il div per evitare duplicati
            canzoni.forEach((canzone, i) => {
                const durataInMinuti = Math.floor(canzone.duration / 60);
                const durataSecondi = canzone.duration % 60;
                const durataFormattata = `${durataInMinuti}:${durataSecondi.toString().padStart(2, '0')}`;
                const newdiv = document.createElement("div");

                // Creo le canzoni in base alle dimensioni dello schermo (maggiori o minori di md)
                newdiv.innerHTML = `
                    <div class="d-none d-md-flex row align-items-center mt-2 p-2 song-row" tabindex="0">
                        <div class="col-7 d-flex align-items-center">
                            <h6 class="grey-text me-4" id="numSong">${i+1}</h6>
                            <img src="${canzone.album.cover}" class="me-4" height="50px" alt="img">
                            <h6 class="text-light song-row pointer">${canzone.title_short}</h6>
                        </div>
                        <div class="col-4">
                            <h6 class="grey-text">100.000.000</h6>
                        </div>
                        <div class="col-1">
                            <h6 class="grey-text">${durataFormattata}</h6>
                        </div>
                    </div>

                    <div class="d-md-none row align-items-center mt-2 p-2 song-row" tabindex="0">
                        <div class="col-12">
                            <div class="row align-items-center">
                                <div class="col-1 d-flex">
                                    <h6 class="grey-text me-4" id="numSong">${i+1}</h6>
                                </div>
                                <div class="col-2 d-flex">
                                <img src="${canzone.album.cover}" class="me-4" height="50px" alt="img">
                                </div>
                                <div class="col-8">
                                    <h6 class="text-light song-title pointer">${canzone.title_short}</h6>
                                    <h6 class="grey-text">100.000.000</h6>
                                </div>
                                <div class="col-1 d-flex">
                                    <i class="bi bi-three-dots-vertical text-light"></i>
                                </div>
                            </div>
                    </div>`;
                divPopolari.appendChild(newdiv);

                // Aggiungi event listener al titolo della canzone
                const songRows = newdiv.querySelectorAll('.song-row');
                songRows.forEach(row => {
                    row.addEventListener('click', () => {
                        updateSongInfo(canzone);
                        playTrack(canzone.preview)

                            });
                        });

                // Aggiungi event listener per l'hover sulla riga della canzone
                const row = newdiv.querySelector('.song-row');
                const trackNumberElement = newdiv.querySelector('#numSong');
                row.addEventListener('mouseover', () => {
                    trackNumberElement.innerHTML = `<i class="fa fa-play small"></i>`;
                });
                row.addEventListener('mouseout', () => {
                    trackNumberElement.textContent = i + 1;
                });
            });
        })
        .catch((err) => {
            console.log('ERRORE!', err);
            alert(`An error occurred: ${err.message}`);
        });
};

function updateSongInfo(canzone) {
    const playPauseDiv = document.querySelector('.control-buttons');
    playPauseDiv.innerHTML=`
    <audio id="trackPlayer" controls style="display: none"></audio>
            <i class="pointer fas fa-random"></i>
            <i class="pointer fas fa-step-backward"></i>
            <i class="pointer play-pause fas fa-pause trigger"></i>
            <i class="pointer fas fa-step-forward"></i>
            <i class="pointer fas fa-undo-alt"></i>`
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
    console.log("click")
    playFunc();
    progressFunc();
}


const playFunc = function () {
    const playPauseButton = document.querySelectorAll(".trigger");
    playPauseButton.forEach((button)=>{
        // Aggiungi evento di click al pulsante play/pausa
        button.addEventListener('click', function () {
            const audioPlayer = document.getElementById('trackPlayer');
            if (audioPlayer.paused) {
                audioPlayer.play();
                button.classList.remove('fa-play');
                button.classList.add('fa-pause');
                
            } else {
                audioPlayer.pause();
                button.classList.remove('fa-pause');
                button.classList.add('fa-play');
            }
        });

    })
}

const progressFunc = function () {
    const audioPlayer = document.getElementById('trackPlayer');
    const progressBar = document.querySelector('.progress');
  
    audioPlayer.addEventListener('timeupdate', function () {
      const duration = audioPlayer.duration;
      const timeSong = document.getElementById("songTime")
      timeSong.innerHTML= formatTime(duration)
      const currentTime = audioPlayer.currentTime;
      const startTime = document.getElementById("startTime")
      startTime.innerHTML= formatTime(currentTime)
  
      // Calcola la percentuale completata
      const progressPercent = (currentTime / duration) * 100;
  
      // Aggiorna la larghezza della barra di progressione
      progressBar.style.width = progressPercent + '%';
    });
  };

const formatTime = function (time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
  
    // Aggiungi uno zero iniziale se i secondi sono inferiore a 10
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
  
    return minutes + ':' + formattedSeconds;
};

const playTrack = (previewUrl) => {
    const audioPlayer = document.getElementById('trackPlayer');
    audioPlayer.src = previewUrl;
    audioPlayer.play();
  };

// Inizia la chiamata API
getArtistData();