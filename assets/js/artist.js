
const addressBarContent = new URLSearchParams(location.search)
console.log(addressBarContent)
const artistId = addressBarContent.get('artistId')

const getArtistData = function () {
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}`)
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
            throw new Error('Network response was not ok ' + response.statusText);
        }
      })
      .then((artist) => {
        const artisti = document.querySelectorAll(".titolo")
        artisti.forEach((artista)=>{
           artista.innerText = artist.name
        })
        getArtistInfo()
        const imgArtista = document.getElementById("artistImg")
        imgArtista.setAttribute("src", artist.picture)
    })
    .catch((err) => {
        console.log('ERRORE!', err)
        alert(`An error occurred: ${err.message}`);
    })
  }
  
  getArtistData()
  

  const getArtistInfo = function(){
    fetch(`https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=50`)
        .then((response)=>{
            if(response.ok){
                return response.json()
            } else {
                throw new Error('Network response was not ok ' + response.statusText);
            }
        })
        .then((song)=>{
            console.log(song)
            let canzoni = song.data.slice(0, 5);
            canzoni.forEach((canzone, i)=>{
                const durataInMinuti = Math.floor(canzone.duration / 60);
                const durataSecondi = canzone.duration % 60;
                const durataFormattata = `${durataInMinuti}:${durataSecondi.toString().padStart(2, '0')}`;
                divPopolari = document.getElementById("popolari");
                const newdiv = document.createElement("div");
                newdiv.innerHTML = `
                    <div class="row align-items-center px-3">
                        <div class="col-7 d-flex mt-3 align-items-center">
                            <h6 class="grey-text me-4">${i+1}</h6>
                            <img src="${canzone.album.cover}" class="me-4" height="35px" alt="img">
                            <h6 class="text-light">${canzone.title_short}</h6>
                        </div>
                        <div class="col-4">
                            <h6 class="grey-text">100.000.000</h6>
                        </div>
                        <div class="col-1">
                            <h6 class="grey-text">${durataFormattata}</h6>
                        </div>
                    </div>`;
                divPopolari.appendChild(newdiv);
            });

            
        })
        .catch((err) => {
            console.log('ERRORE!', err)
            alert(`An error occurred: ${err.message}`);
          })
  }