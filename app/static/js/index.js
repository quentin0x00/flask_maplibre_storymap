window.isMarkerClick = false;

import { fetchData } from './data.js';
import { createEncarts } from './component-encart.js';
import { createMarkers } from './component-marker.js';
import { initMap, add3DBuildings } from './map.js';

async function initApp() {
    const { encarts, markers } = await fetchData();
    window.encarts = encarts;
    window.markers = markers;

    const map = initMap();
    if (map) {
        map.once('idle', function () {
            add3DBuildings(map);
        });
        createMarkers(map, markers);
        createEncarts(encarts, map);
    }
}

initApp();  