// data.js
export async function fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        const encarts = data;
        const markers = data.map(encart => ({
            id: encart.id,
            lng: encart.center[0],
            lat: encart.center[1],
            title: encart.title,
            url_img: encart.url_img,
            border_color: encart.border_color,
            bg_size : encart.bg_size
        }));

        return { encarts, markers };
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return { encarts: [], markers: [] };
    }
}