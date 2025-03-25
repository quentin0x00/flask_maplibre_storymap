export function createPopup(item, index, totalMarkers) {
    const popupContent = document.createElement('div');
    popupContent.className = 'custom-popup';
    
    // Construction du HTML en une seule opération
    popupContent.innerHTML = `
        <div class="popup-header">
            <span class="popup-title">${item.popup.title}</span>
            <span class="popup-counter" style="background:${item.param.border_color}">
                ${index + 1}/${totalMarkers}
            </span>
        </div>
        ${item.popup.date ? `<div class="popup-date">${item.popup.date}</div>` : ''}
    `;
    
    return new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    }).setDOMContent(popupContent);
}

export function setupPopupEvents(markerElement, popup, map, coordinates) {
    markerElement.addEventListener('mouseenter', () => popup.setLngLat(coordinates).addTo(map));
    markerElement.addEventListener('mouseleave', () => popup.remove());
}