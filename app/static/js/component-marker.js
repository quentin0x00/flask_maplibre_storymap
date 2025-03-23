import { setActiveencart } from './component-encart.js';

export function createMarkers(map, markers) {
    markers.forEach((marker, index) => {
        const markerElement = createCustomMarker(marker);
        const popup = createPopup(marker, index, markers.length);

        markerElement.addEventListener('mouseenter', () => {
            popup.setLngLat([marker.lng, marker.lat]).addTo(map);
        });
        markerElement.addEventListener('mouseleave', () => {
            popup.remove();
        });

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
    
    const titleSpan = document.createElement('span');
    titleSpan.textContent = `${marker.title_popup} `;
    titleSpan.style.color = 'black';
    titleSpan.style.fontWeight = 'bold';
    titleSpan.style.fontFamily = 'Arial';
    titleSpan.style.fontSize = '14px';

    const indexSpan = document.createElement('span');
    indexSpan.textContent = `${index + 1}/${totalMarkers}`;
    indexSpan.style.backgroundColor = marker.border_color;
    indexSpan.style.color = 'white';
    indexSpan.style.padding = '2px 6px';
    indexSpan.style.borderRadius = '12px';
    indexSpan.style.marginLeft = '4px';
    indexSpan.style.fontWeight = 'bold';
    indexSpan.style.fontFamily = 'Arial';
    indexSpan.style.fontSize = '14px';

    popupContent.appendChild(titleSpan);
    popupContent.appendChild(indexSpan);

    if (marker.date) {
        const dateSpan = document.createElement('span');
        dateSpan.textContent = `\n${marker.date}`;
        dateSpan.style.color = 'black';
        dateSpan.style.fontFamily = 'Arial';
        dateSpan.style.fontSize = '14px';
        dateSpan.style.whiteSpace = 'pre-line';

        popupContent.appendChild(dateSpan);
    }

    return new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
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