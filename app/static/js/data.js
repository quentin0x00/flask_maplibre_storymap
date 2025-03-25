export async function fetchData() {
    try {
        const response = await fetch('/api/data', {
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result || !Array.isArray(result.data)) {
            throw new Error('Format de données invalide');
        }
        
        return result.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
}
