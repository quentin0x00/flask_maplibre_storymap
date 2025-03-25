let currentActiveEncart = null;
let isButtonClick= false;
let isMarkerClick = false; 

// Encart actif
export function setActiveEncart(encartId, map) {
    if (currentActiveEncart === encartId) return;

    const activeEncart = document.querySelector('.active');
    if (activeEncart) {
        activeEncart.classList.remove('active');
        activeEncart.style.willChange = '';
    }

    const newActiveEncart = document.getElementById(encartId);
    if (newActiveEncart) {
        newActiveEncart.classList.add('active');
        newActiveEncart.style.willChange = 'transform';
        currentActiveEncart = encartId;
        EncartflyToMarker(encartId, map);
    }
}

// Fly to marqueur sur activation de l'encart
export function EncartflyToMarker(encartId, map) {
    const item = window.markersData.find(d => d.id === encartId);
    if (!item) return;

    map.flyTo({
        center: [item.geom.lng, item.geom.lat],
        zoom: item.param.zoom,
        bearing: item.param.bearing,
        pitch: item.param.pitch,
        speed: item.param.speed
    });
}

// Activation de l'encart via scroll (sauf si scrollintoview trigger via bouton/marker)
export function setupScrollNavigation(data, map) {
    if (data.length === 0) return;

    let isScrolling = false;

    document.getElementById('panneau').onscroll = function() {
        if (isMarkerClick || isButtonClick) return;

        if (!isScrolling) {
            isScrolling = true;
            window.requestAnimationFrame(() => {
                for (const item of data) {
                    if (isElementOnScreen(item.id)) {
                        setActiveEncart(item.id, map);
                        break;
                    }
                }
                isScrolling = false;
            });
        }
    };
}
function isElementOnScreen(id) {
    const element = document.getElementById(id);
    if (!element) return false;
    
    const { scrollTop, clientHeight } = document.getElementById('panneau');
    const { offsetTop, clientHeight: elementHeight } = element;
    const threshold = clientHeight * 0.2;
    
    const elementTop = offsetTop - scrollTop;
    const elementBottom = elementTop + elementHeight;
    
    return elementTop <= threshold && elementBottom > threshold;
}

// Activation de l'encart via boutons
export function setupNavigationButtons(map) {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.prev-button, .next-button, .first-section-button');
        if (!btn) return;

        isButtonClick = true;
        
        const currentId = btn.dataset.sectionId;
        let targetSection = null;

        if (btn.classList.contains('prev-button')) {
            const current = document.getElementById(currentId);
            targetSection = current?.previousElementSibling;
        } 
        else if (btn.classList.contains('next-button')) {
            const current = document.getElementById(currentId);
            targetSection = current?.nextElementSibling;
        }
        else {
            targetSection = document.querySelector('section:first-of-type');
        }

        if (targetSection?.tagName === 'SECTION') {
            setActiveEncart(targetSection.id, map);
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(() => {
                isButtonClick = false;
            }, 1000);
        }
    });
}

// Activation de l'encart via marqueur cliqué
export function handleMarkerClick(item, map) {
    isMarkerClick = true;
    flyToMarkerPosition(item, map);
    const section = document.getElementById(item.id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveEncart(item.id, map);
    setTimeout(() => {
        isMarkerClick = false;
    }, 1000);
}

// Fly to position/dézoom depuis marqueur cliqué
function flyToMarkerPosition(item, map) {
    const currentZoom = map.getZoom();
    const activeSection = document.querySelector('.active');

    if (activeSection && activeSection.id === item.id && currentZoom > 15) {
        map.flyTo({
            center: [item.geom.lng, item.geom.lat],
            zoom: 3,
            speed: 1.3,
            bearing: 0,
            pitch: 0
        });
    } else {
        map.flyTo({
            center: [item.geom.lng, item.geom.lat],
            zoom: item.param.zoom,
            speed: item.param.speed,
            bearing: item.param.bearing,
            pitch: item.param.pitch
        });
    }
}