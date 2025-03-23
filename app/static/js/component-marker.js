import { setActiveencart } from './component-encart.js';

export function createMarkers(map, markers) {
    markers.forEach(marker => {
        const markerElement = createCustomMarker(marker);
        markerElement.addEventListener('click', () => handleMarkerClick(map, marker));
        new maplibregl.Marker({ element: markerElement })
            .setLngLat([marker.lng, marker.lat])
            .addTo(map);
    });
}

function createCustomMarker(marker) {
    const el = document.createElement('div');
    el.style.width = '60px';
    el.style.height = '60px';
    el.style.borderRadius = '50%';
    el.style.border = `6px solid ${marker.border_color}`;
    el.style.backgroundImage = `url('${marker.url_img}')`;
    el.style.backgroundSize = '100%';
    el.style.backgroundPosition = 'center';
    el.style.backgroundColor = '#fff';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.cursor = 'pointer';
    return el;
}

let isMarkerClick = false; // Indicateur pour suivre les clics sur les marqueurs
function handleMarkerClick(map, marker) {
    const sectionId = marker.id;
    const section = document.getElementById(sectionId);
    const currentZoom = map.getZoom();
    const activeSection = document.querySelector('.active');

    if (activeSection && activeSection.id === sectionId && currentZoom > 15) {
        map.flyTo({
            center: [marker.lng, marker.lat],
            zoom: 3,
            speed: 1.3,
            bearing: 0,
            pitch: 0
        });
    } else {
        isMarkerClick = true; // Activation de l'indicateur
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        setActiveencart(sectionId, map);

        // Désactiver l'indicateur après un court délai
        setTimeout(() => {
            isMarkerClick = false;
        }, 1000); // Ajustez le délai en fonction de la durée de l'animation
    }
}