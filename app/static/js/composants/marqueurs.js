import { createPopup, setupPopupEvents } from './popup.js';
import { handleMarkerClick } from '../navigation.js';

export function createMarkers(map, data) {
    data.forEach((item, index) => {
        const markerElement = createCustomMarker(item);
        const popup = createPopup(item, index, data.length);
        
        setupPopupEvents(markerElement, popup, map, [item.geom.lng, item.geom.lat]);

        markerElement.addEventListener('click', () => {
            handleMarkerClick(item, map);
        });

        new maplibregl.Marker({ element: markerElement })
            .setLngLat([item.geom.lng, item.geom.lat])
            .addTo(map);
        
        handleMarkerClick(item, map)
    });
}

function createCustomMarker(item) {
    const el = document.createElement('div');
    Object.assign(el.style, {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: `6px solid ${item.param.border_color}`,
        backgroundImage: `url('${item.param.img_url}')`,
        backgroundSize: item.param.img_fill_size,
        backgroundPosition: 'center',
        backgroundColor: '#fff',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer'
    });
    return el;
}