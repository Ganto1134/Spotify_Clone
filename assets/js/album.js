const addressBarContent = new URLSearchParams(location.search);
const albumId = addressBarContent.get("albumtId");
console.log("AlbumID?", albumId);

// Fetch per ottenere i dati e modificare la "copertina"
const getAlbumData = function () {
  fetch(`https://striveschool-api.herokuapp.com/api/deezer/album/${albumId}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Errore nel recupero dei dettagli del frutto");
      }
    })
    .then((album) => {
      console.log("DETTAGLI RECUPERATI", album);
      const albumImage = document.querySelectorAll(".album-image");
      albumImage.forEach((element) => {
        element.src = album.cover_big;
      });
      const artistIcon = document.querySelectorAll(".icona-artista");
      artistIcon.forEach((element)=> {
        element.src = album.artist.picture_small;
      });
      const titoloAlbum = document.querySelectorAll(".titolo-album");
      titoloAlbum.forEach((element)=> {
        element.innerHTML = album.title;
      });
      const durataInMinuti = album.duration / 60;
      const durataFormattata = `${Math.floor(durataInMinuti)} min ${Math.floor(album.duration % 60)} sec`;
      document.querySelector(".durata-album").innerHTML = durataFormattata;
      document.querySelector(
        ".numero-brani"
      ).innerHTML = `${album.tracks.data.length} brani`;
      const releaseYear = album.release_date.substring(0, 4);
      const annoAlbum = document.querySelectorAll(".anno-album");
      annoAlbum.forEach((element) => {
        element.innerHTML = ` · ${releaseYear}`;
      });
      const artistElements = document.querySelectorAll(".nome-artista");
      artistElements.forEach((element) => {
        element.innerHTML = album.artist.name;
      });

      // Popolo la tracklist
      const container = document.getElementById("container-canzoni");
      container.innerHTML = "";
      album.tracks.data.forEach((traccia, indice) => {
        const riproduzioniCasuali = Math.floor(Math.random() * 10101);
        const durInMinuti = Math.floor(traccia.duration / 60);
        const durSecondi = traccia.duration % 60;
        const durFormattata = `${durInMinuti}:${durSecondi.toString().padStart(2, '0')}`;
      
        const rigaHTML = `
        <div class="row song-row">
        <div class="d-flex align-items-center justify-content-between">
        <div class="col-md-1 p-0 mr-n3 d-none d-md-block">
                <p id="numero-traccia-${indice}">${indice + 1}</p>
            </div>
        <div class="col-md-6 p-0">
            <p class="mb-1 font-weight-bold titolo-canzone">${traccia.title}</p>
            <a class="text-white" href="artist.html?artistId=${traccia.artist.id}">
            <p class="nome-artista">${traccia.artist.name}</p></a>
        </div>
        <div class="col d-md-none pb-2 text-end">
            <i class="bi bi-three-dots-vertical" style="font-size: 1.5rem;"></i>
        </div>
        <div class="col-md-3 me-2 d-none d-md-block text-end">
            <p class="riproduzioni-totali">${riproduzioniCasuali}</p>
        </div>
        <div class="col-md-2 d-none d-md-block text-end">
            <p class="durata-canzone">${durFormattata}</p>
        </div>
        </div>
    </div>
  `;
  
  updateSongInfo(traccia)
  const playPauseDiv = document.querySelector('.control-buttons');
  playPauseDiv.innerHTML=`
  <audio id="trackPlayer" controls style="display: none"></audio>
          <i class="pointer fas fa-random"></i>
          <i class="pointer fas fa-step-backward"></i>
          <i class="pointer play-pause fas fa-play trigger"></i>
          <i class="pointer fas fa-step-forward"></i>
          <i class="pointer fas fa-undo-alt"></i>`

          let artistaTop = document.querySelector('p a')
          if (artistaTop) {
            artistaTop.href = `artist.html?artistId=${traccia.artist.id}`;
        }
        container.insertAdjacentHTML("beforeend", rigaHTML);
      });
      
       // Aggiungi event listener per ciascun titolo della canzone
      document.querySelectorAll(".titolo-canzone").forEach((element, index) => {
        element.addEventListener('click', () => {
          updateSongInfo(album.tracks.data[index]);
          playTrack(album.tracks.data[index].preview)
        });
      });
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};


/* gradiente adattivo in base alla copertina */

window.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".album-image");
  const albumInfos = document.querySelectorAll(".album-info");

  // Funzione per ottenere il colore medio dell'immagine e applicarlo al background
  function applyAverageColorToBackground(image, albumInfo) {
    getAverageColor(image.src)
      .then((color) => {
        
        albumInfo.style.background = `linear-gradient(to bottom, ${color}, #212121)`;
      })
      .catch((error) => {
        console.error("Si è verificato un errore nel calcolo del colore medio:", error);
      });
  }

  // Assicurati che le immagini siano state caricate prima di applicare il colore di sfondo
  images.forEach((image, index) => {    
      image.onload = function () {
        applyAverageColorToBackground(image, albumInfos[index]);
      };    
  });

});

// Funzione per calcolare il colore medio dell'immagine
function getAverageColor(imageUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = imageUrl;
    image.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let r = 0,
        g = 0,
        b = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        r += imageData.data[i];
        g += imageData.data[i + 1];
        b += imageData.data[i + 2];
      }
      const pixelCount = imageData.data.length / 4;
      const averageColor = `rgb(${Math.floor(r / pixelCount)}, ${Math.floor(
        g / pixelCount
      )}, ${Math.floor(b / pixelCount)})`;
      resolve(averageColor);
    };
    image.onerror = function () {
      reject(new Error("Impossibile caricare l'immagine"));
    };
  });
}


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


getAlbumData();