window.addEventListener('DOMContentLoaded', function () {
    const image = document.getElementById('album-image');
    const albumInfo = document.getElementById('album-info');

    // Ottieni i colori dall'immagine
    getAverageColor(image.src)
        .then(color => {
            // Applica il gradiente al div
            albumInfo.style.background = `linear-gradient(to bottom, ${color}, rgba(0, 0, 0, 0.5))`;
        })
        .catch(error => {
            console.error('Si è verificato un errore nel calcolo del colore medio:', error);
        });
});

// Funzione per calcolare il colore medio dell'immagine
function getAverageColor(imageUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = imageUrl;
        image.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let r = 0, g = 0, b = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                r += imageData.data[i];
                g += imageData.data[i + 1];
                b += imageData.data[i + 2];
            }
            const pixelCount = imageData.data.length / 4;
            const averageColor = `rgb(${Math.floor(r / pixelCount)}, ${Math.floor(g / pixelCount)}, ${Math.floor(b / pixelCount)})`;
            resolve(averageColor);
        };
        image.onerror = function () {
            reject(new Error('Impossibile caricare l\'immagine'));
        };
    });
}