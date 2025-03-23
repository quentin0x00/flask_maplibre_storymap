// map.js
export function initMap() {
    if (typeof maplibregl === 'undefined') {
        console.error('MapLibre GL JS n\'est pas chargé.');
        return null;
    }

    const map = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            sources: {
                'voyager-raster': {
                    type: 'raster',
                    tiles: ['https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],
                    tileSize: 256,
                    attribution: '©<a href="https://carto.com/about-carto/" target="_blank">Carto</a>'
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
        pitch: -20,
        attributionControl: false,
    });

    map.on('style.load', () => {
        map.setProjection({ type: 'globe' });
    });

    map.on('load', () => {
        map.flyTo({
            center: ['-1.553603493340308', '47.218599718064844'],
            zoom: 16,
            speed: 1.6,
            bearing: 0,
            pitch: 60
        });
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 80, unit: "metric" }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({
        compact: true,
        customAttribution: ["©<a href='https://maplibre.org/' target='_blank'>MapLibre</a>"]
    }), 'bottom-left');

    return map;
}

export function add3DBuildings(map) {
    if (map.getLayer('3d-buildings')) return;
    if (!map.getSource('openmaptiles')) {
        map.addSource('openmaptiles', {
            type: 'vector',
            tiles: ['https://tiles.openfreemap.org/planet/20250129_001002_pt/{z}/{x}/{y}.pbf'],
            minzoom: 13,
            maxzoom: 14,
            attribution: "©<a href='https://openmaptiles.org/' target='_blank'>OpenMapTiles, données OSM</a>"
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