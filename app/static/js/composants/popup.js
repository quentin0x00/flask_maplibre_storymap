export function createPopup(item, index, totalMarkers) {
    const popupContent = createPopupContent(item, index, totalMarkers);
    
    return new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    }).setDOMContent(popupContent);
}

function createPopupContent(item, index, totalMarkers) {
    const popupContent = document.createElement('div');
    
    // Titre
    const titleSpan = document.createElement('span');
    titleSpan.textContent = `${item.popup.title} `;
    applyPopupStyle(titleSpan, {
        color: 'black',
        fontWeight: 'bold',
        fontFamily: 'Arial',
        fontSize: '14px'
    });

    // Index
    const indexSpan = document.createElement('span');
    indexSpan.textContent = `${index + 1}/${totalMarkers}`;
    applyPopupStyle(indexSpan, {
        backgroundColor: item.param.border_color,
        color: 'white',
        padding: '2px 6px',
        borderRadius: '12px',
        marginLeft: '4px',
        fontWeight: 'bold',
        fontFamily: 'Arial',
        fontSize: '14px'
    });

    popupContent.appendChild(titleSpan);
    popupContent.appendChild(indexSpan);

    // Date
    if (item.popup.date) {
        const dateSpan = document.createElement('span');
        dateSpan.textContent = `\n${item.popup.date}`;
        applyPopupStyle(dateSpan, {
            color: 'black',
            fontFamily: 'Arial',
            fontSize: '14px',
            whiteSpace: 'pre-line'
        });
        popupContent.appendChild(dateSpan);
    }

    return popupContent;
}

function applyPopupStyle(element, styles) {
    Object.assign(element.style, styles);
}

export function setupPopupEvents(markerElement, popup, map, coordinates) {
    markerElement.addEventListener('mouseenter', () => {
        popup.setLngLat(coordinates).addTo(map);
    });
    
    markerElement.addEventListener('mouseleave', () => {
        popup.remove();
    });
}