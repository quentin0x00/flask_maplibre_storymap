export async function fetchData() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }
        const { encarts, markers } = await response.json();
        return { encarts, markers };
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return { encarts: [], markers: [] };
    }
}