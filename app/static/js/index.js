import { fetchData } from './data.js';
import { createEncarts } from './composants/panneau.js';
import { createMarkers } from './composants/marqueurs.js';
import { initMap, add3DBuildings } from './composants/carte.js';

async function initFront() {
    try {
        const data = await fetchData();
        window.markersData = data;

        const map = initMap();
        map.once('idle', () => {
            add3DBuildings(map);
        });

        createMarkers(map, data);
        createEncarts(data, map);

    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showError();
    }
}

function showError() {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
            <div class="error-container">
                <h2>Erreur de chargement</h2>
                <p>Impossible de charger les données.</p>
                <button class="reload-btn">Réessayer</button>
            </div>
        `;
        document.querySelector('.reload-btn').onclick = () => location.reload();
    }
}

document.addEventListener('DOMContentLoaded', initFront);