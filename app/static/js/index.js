import { fetchData } from './data.js';
import { createEncarts } from './composants/panneau.js';
import { createMarkers } from './composants/marqueurs.js';
import { initMap, add3DBuildings } from './composants/carte.js';

const INIT_TIMEOUT = 30000;

async function initFront() {
    try {
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout dépassé')), INIT_TIMEOUT));
        
        const dataPromise = fetchData();
        const data = await Promise.race([dataPromise, timeoutPromise]);

        const markersData = Object.freeze(data);
        Object.defineProperty(window, 'markersData', {
            value: markersData,
            writable: false,
            configurable: false
        });

        const map = initMap();
        map.on('load', () => {
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
    const app = document.getElementById('app') || document.body;

    while (app.firstChild) {
        app.removeChild(app.firstChild);
    }
    
    const errorHTML = `
        <div class="error-container">
            <h2>Erreur de chargement</h2>
            <p>Impossible de charger les données.</p>
            <button class="reload-btn">Réessayer</button>
        </div>
    `;
    
    app.insertAdjacentHTML('beforeend', errorHTML);
    
    const btn = app.querySelector('.reload-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            window.location.reload(true);
        });
    }
}

if (document.readyState !== 'loading') {
    initFront().catch(console.error);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        initFront().catch(console.error);
    });
}