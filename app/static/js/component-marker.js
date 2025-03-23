import { setActiveencart } from './component-encart.js';

export function createMarkers(map, markers) {
    markers.forEach((marker, index) => {
        const markerElement = createCustomMarker(marker);
        const popup = createPopup(marker, index, markers.length);

        // Ajouter le popup au survol
        markerElement.addEventListener('mouseenter', () => {
            popup.setLngLat([marker.lng, marker.lat]).addTo(map);
        });

        // Supprimer le popup quand on quitte le marqueur
        markerElement.addEventListener('mouseleave', () => {
            popup.remove();
        });

        // Gérer le clic sur le marqueur
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
    el.style.backgroundSize = `${marker.bg_size}`;
    el.style.backgroundPosition = 'center';
    el.style.backgroundColor = '#fff';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.cursor = 'pointer';
    return el;
}

function createPopup(marker, index, totalMarkers) {
    const popupContent = document.createElement('div');
    
    // Créer un span pour le titre
    const titleSpan = document.createElement('span');
    titleSpan.textContent = `${marker.title_popup} `; // Titre du marqueur
    titleSpan.style.color = 'black'; // Couleur du texte
    titleSpan.style.fontWeight = 'bold'; // Couleur du texte
    titleSpan.style.fontFamily = 'Arial'; // Couleur du texte

    // Créer un span pour l'index et le total
    const indexSpan = document.createElement('span');
    indexSpan.textContent = `${index + 1}/${totalMarkers}`;
    indexSpan.style.backgroundColor = marker.border_color; // Couleur de fond dynamique
    indexSpan.style.color = 'white'; // Couleur du texte
    indexSpan.style.padding = '2px 6px'; // Padding pour améliorer l'apparence
    indexSpan.style.borderRadius = '12px'; // Coins arrondis
    indexSpan.style.marginLeft = '4px'; // Espacement entre le titre et l'index
    indexSpan.style.fontWeight = 'bold'; // Couleur du texte
    indexSpan.style.fontFamily = 'Arial'; // Couleur du texte
    

    // Ajouter les spans au contenu du popup
    popupContent.appendChild(titleSpan);
    popupContent.appendChild(indexSpan);

    return new maplibregl.Popup({
        closeButton: false, // Désactiver le bouton de fermeture
        closeOnClick: false // Ne pas fermer le popup au clic
    }).setDOMContent(popupContent);
}
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
        map.flyTo({
            center: [marker.lng, marker.lat],
            zoom: 16,
            speed: 1.3,
            bearing: 0,
            pitch: 60
        });
    }

    window.isMarkerClick = true;
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveencart(sectionId, map);

    setTimeout(() => {
        window.isMarkerClick = false;
    }, 1000);
}