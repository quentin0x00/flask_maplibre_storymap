document.addEventListener('DOMContentLoaded', function () {

    /* Réinitialiser le panneau au chargement de la page */
    const firstChapterId = Object.keys(chapters)[0];
    const firstSection = document.getElementById(firstChapterId);
    if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
    }


    /* Carte */
    const map = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            sources: {
                'voyager-raster': {
                    type: 'raster',
                    tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],
                    tileSize: 256,
                    attribution: '© <a href="https://carto.com/about-carto/" target="_blank">Carto</a>'
                }
            },
            layers: [{
                id: 'voyager-raster-layer',
                type: 'raster',
                source: 'voyager-raster'
            }]
        },
        center: ['-1.553603493340308', '47.218599718064844'],
        zoom: 2,
        // bearing: 20,
        pitch: -20,
        attributionControl: false,
    });

    map.on('style.load', () => {
        map.setProjection({
            type: 'globe',
        });
    });

    map.on('load', () => {
        map.flyTo({
            center: ['-1.553603493340308', '47.218599718064844'],
            zoom: 16,
            speed: 1.3,
            bearing: 0,
            pitch: 60
        });
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 80, unit: "metric" }), 'bottom-left');
    map.addControl(new maplibregl.AttributionControl({
        compact: true,
        customAttribution: [
            "© <a href='https://maplibre.org/' target='_blank'>MapLibre</a>"
        ]
    }), 'bottom-right');


    function add3DBuildings() {
        if (map.getLayer('3d-buildings')) return;
        if (!map.getSource('openmaptiles')) {
            map.addSource('openmaptiles', {
                type: 'vector',
                tiles: ['https://tiles.openfreemap.org/planet/20250129_001002_pt/{z}/{x}/{y}.pbf'],
                minzoom: 13,
                maxzoom: 14,
                attribution: "© <a href='https://openfreemap.org/' target='_blank'>OpenFreeMap</a>"
            });
        }
        map.addLayer({
            id: '3d-buildings',
            type: 'fill-extrusion',
            source: 'openmaptiles',
            'source-layer': 'building',
            minzoom: 14,
            paint: {
                'fill-extrusion-color': '#DCD9D6',
                'fill-extrusion-height': [
                    "case",
                    ["has", "render_height"], ["get", "render_height"],
                    ["get", "height"]
                ],
                "fill-extrusion-opacity": 0.75
            }
        });
    }
    map.once('idle', function () {
        add3DBuildings();
    });



    /* Markers */
    function createCustomMarker(marker) {
        const el = document.createElement('div');
        el.style.width = '50px';
        el.style.height = '50px';
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
    
    markers.forEach(marker => {
        const markerElement = new maplibregl.Marker({
            element: createCustomMarker(marker)
        })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map);

        // Interaction marker - panneau
        markerElement.getElement().addEventListener('click', () => {
            console.log('Marqueur cliqué :', marker.id);
            const sectionId = marker.id;
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    /* Panneau */
    let activeChapterName = Object.keys(chapters)[0];
    setActiveChapter(activeChapterName);

    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;
        map.flyTo(chapters[chapterName]);
        document.getElementById(chapterName).classList.add('active');
        document.getElementById(activeChapterName).classList.remove('active');
        activeChapterName = chapterName;
    }

    // Vérifie si un élément est visible au sein de #features
    function isElementOnScreen(id) {
        const element = document.getElementById(id);
        if (!element) return false;
        const featuresDiv = document.getElementById('features');
        const featuresScrollTop = featuresDiv.scrollTop;
        const featuresHeight = featuresDiv.clientHeight;
        const threshold = featuresHeight * 0.2;
        const elementOffsetTop = element.offsetTop;
        const elementHeight = element.clientHeight;
        return elementOffsetTop - featuresScrollTop <= threshold &&
            elementOffsetTop + elementHeight - featuresScrollTop > threshold;
    }

    // Gestion du défilement pour changer d'encart
    document.getElementById('features').onscroll = function () {
        const chapterNames = Object.keys(chapters);
        for (const chapterName of chapterNames) {
            if (isElementOnScreen(chapterName)) {
                setActiveChapter(chapterName);
                break;
            }
        }
    };
});

// Boutons de navigation du panneau
function scrollToPreviousSection(currentSectionId) {
    const currentSection = document.getElementById(currentSectionId);
    if (!currentSection) return;

    const prevSection = currentSection.previousElementSibling;
    if (prevSection && prevSection.tagName === 'SECTION') {
        prevSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToNextSection(currentSectionId) {
    const currentSection = document.getElementById(currentSectionId);
    if (!currentSection) return;

    const nextSection = currentSection.nextElementSibling;
    if (nextSection && nextSection.tagName === 'SECTION') {
        nextSection.scrollIntoView({ behavior: 'smooth' });
    }
}