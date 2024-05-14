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

      document.getElementById("album-image").src = album.cover_big;
      document.querySelector(".titolo-album").innerHTML = album.title;
      const durataInMinuti = album.duration / 60;
    const durataFormattata = `${Math.floor(durataInMinuti)} min ${Math.floor(album.duration % 60)} sec`;
    document.querySelector(".durata-album").innerHTML = durataFormattata;
      document.querySelector(
        ".numero-brani"
      ).innerHTML = `${album.tracks.data.length} brani`;
      const releaseYear = album.release_date.substring(0, 4);
      document.querySelector(".anno-album").innerHTML = releaseYear;
      const artistElements = document.querySelectorAll(".nome-artista");
      artistElements.forEach((element) => {
        element.innerHTML = album.artist.name;
      });

      // Popolo la tracklist
      const container = document.getElementById("container-canzoni");
      container.innerHTML = "";
      album.tracks.data.forEach((traccia, indice) => {
        const riproduzioniCasuali = Math.floor(Math.random() * 10101);
        const durataInMinuti = (traccia.duration / 60).toFixed(2);
        const rigaHTML = `
        <div class="row align-items-center">
            <div class="col-md-1 mr-n3">
                <p id="numero-traccia-${indice}">${indice + 1}</p>
            </div>
            <div class="col-md-6">
                <p class="mb-1 font-weight-bold titolo-canzone">${
                  traccia.title
                }</p>
                <p class="nome-artista">${traccia.artist.name}</p>
            </div>
            <div class="col-md-3 text-end">
                <p class="riproduzioni-totali">${riproduzioniCasuali}</p>
            </div>
            <div class="col-md-2 text-end">
                <p class="durata-canzone">${durataInMinuti}</p>
            </div>
        </div>
    `;
        container.insertAdjacentHTML("beforeend", rigaHTML);
      });
    })
    .catch((err) => {
      console.log("ERRORE", err);
    });
};

getAlbumData();

window.addEventListener("DOMContentLoaded", function () {
  const image = document.getElementById("album-image");
  const albumInfo = document.getElementById("album-info");

  image.onload = function () {
    // Ottieni i colori dall'immagine
    getAverageColor(image.src)
      .then((color) => {
        // Applica il gradiente al div
        albumInfo.style.background = `linear-gradient(to bottom, ${color}, rgba(0, 0, 0, 0.5))`;
      })
      .catch((error) => {
        console.error(
          "Si è verificato un errore nel calcolo del colore medio:",
          error
        );
      });
  };
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
