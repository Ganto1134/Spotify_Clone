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
        <div class="row">
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
        });
      });
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};

function updateSongInfo(canzone) {
  const player = document.querySelector('.song-infos');
  player.innerHTML = `
      <div class="image-container">
          <img src="${canzone.album.cover}" alt="album cover" />
      </div>
      <div class="song-description pointer">
          <p class="title">${canzone.title}</p>
          <p class="artist">${canzone.artist.name}</p>
      </div>
  `;
}

getAlbumData();

window.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".album-image");
  const albumInfos = document.querySelectorAll(".album-info");

  // Funzione per ottenere il colore medio dell'immagine e applicarlo al background
  function applyAverageColorToBackground(image, albumInfo) {
    getAverageColor(image.src)
      .then((color) => {
        albumInfo.style.background = `linear-gradient(to bottom, ${color}, rgba(0, 0, 0, 0.5))`;
      })
      .catch((error) => {
        console.error("Si è verificato un errore nel calcolo del colore medio:", error);
      });
  }

  // Assicurati che le immagini siano state caricate prima di applicare il colore di sfondo
  images.forEach((image, index) => {
    if (image.complete) {
      applyAverageColorToBackground(image, albumInfos[index]);
    } else {
      image.onload = function () {
        applyAverageColorToBackground(image, albumInfos[index]);
      };
    }
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
