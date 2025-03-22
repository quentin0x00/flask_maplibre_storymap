from flask import Flask, render_template
import csv
import os
import json

app = Flask(__name__)

CSV_FILE = 'data.csv'

def load_data_from_csv():
    """Charge les données depuis le fichier CSV."""
    chapters = {}
    chapter_content = []
    markers = []

    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                chapter_id = row['id']
                chapters[chapter_id] = {
                    'bearing': float(row['bearing']),
                    'center': [float(row['longitude']), float(row['latitude'])],
                    'zoom': float(row['zoom']),
                    'pitch': float(row.get('pitch', 0)),
                    'speed': float(row.get('speed', 1.0))
                }
                chapter_content.append({
                    'id': chapter_id,
                    'title': row['title'],
                    'role': row.get('role', ''),  # Ajouter le rôle
                    'date': row.get('date', ''),  # Ajouter la date
                    'content': row.get('content', ''),  # Ajouter le contenu
                    'skills': row.get('skills', ''),  # Ajouter les compétences
                    'link': row.get('link', ''),  # Ajouter le lien
                    'link_alias': row.get('link_alias', '')  # Ajouter l'alias du lien
                })
                markers.append({
                    'id': chapter_id,
                    'lng': float(row['longitude']),
                    'lat': float(row['latitude']),
                    'title': row['title']
                })
    except FileNotFoundError:
        print(f"Le fichier {CSV_FILE} n'a pas été trouvé.")
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier CSV: {e}")

    return chapters, chapter_content, markers

@app.route('/')
def index():
    """Affiche la page principale avec les données du CSV."""
    chapters, chapter_content, markers = load_data_from_csv()

    # Conversion en JSON des données des chapitres et des marqueurs
    chapters_json = json.dumps(chapters)
    markers_json = json.dumps(markers)

    return render_template('index.html',
                           chapters_json=chapters_json,
                           chapter_content=chapter_content,
                           markers_json=markers_json)

def create_csv_if_not_exists():
    """Crée un fichier CSV exemple si le fichier n'existe pas déjà."""
    if not os.path.exists(CSV_FILE):
        try:
            with open(CSV_FILE, 'w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow(['id', 'title', 'role', 'date', 'content', 'skills', 'bearing', 'longitude', 'latitude', 'zoom', 'pitch', 'speed', 'link', 'link_alias'])
                writer.writerows([
                    ['2025', 'Bonjour ! 👋', "Géomaticien basé sur Nantes.", "", "J'administre un SGBD spatial, ; automatise les traitements, ; et gère un portail web-cartographique.","PostgreSQL ; Python ; GeoServer ; Qgis ; Gdal/Ogr ; Vmap ; Maplibre ; Flask  ; Git ; Docker ; Linux", '0', '-1.553603493340308', '47.218599718064844', '15', '60', '1.3', '#', 'Contactez moi'],
                    ['2023', 'Abei Energy ⚡️', "Chargé d'études SIG (cdi - poste actuel)", "02|2023 - Présent", '> Automatisation du traitement de données  ; > Développement et maintenance du webSIG de l\'entreprise', "PostgreSQL ; Python ; GeoServer ; Qgis ; Gdal/Ogr ; Vmap ; Git ; Docker",'0', '-3.6914852859185343', '40.42880022606314', '15', '60', '1.3', '#', 'Abei Energy'],
                    ['2022', 'Thema Environnement 🌱', "Géomaticien (cdd - 6 mois)", "05|2022 - 11|2022", '> Traitement de données; > Analyses spatiales; > Atlas et cartographies', "PostgreSQL; Qgis ; Arcgis ; Gdal; Adobe Illustrator", '0', '-1.1857005797117022', '47.40885995562285', '15', '60', '1.3', '#', 'Thema Environnement'],
                    ['2021', 'GIP Littoral 🌊', "Chargé d'études SIG (cdd - 6 mois & stage - 6 mois)", "03|2021 - 04|2022", '> Traitement de données; > Analyses spatiales; > Atlas et cartographies', "PostgreSQL; Qgis ; Gdal; Adobe Illustrator", '0', '-0.5513001527871958', '44.82764741819648', '15', '60', '1.3', '#', 'Gip Littoral'],
                    ['2016', 'Université de Nantes IGARUN 📚', "Master 2 - SIG", "09|2016 - 09|2021", '> Traitement de données; > Analyses spatiales; > Atlas et cartographies', "PostgreSQL; Python ; Qgis ; Adobe Illustrator", '0', '-1.5492718817522353', '47.24614588519798', '15', '60', '1.3', '#', 'Université de Nantes']
                ])
            print(f"Fichier {CSV_FILE} créé avec des données d'exemple.")
        except Exception as e:
            print(f"Erreur lors de la création du fichier CSV : {e}")

if __name__ == '__main__':
    create_csv_if_not_exists()  # Créer le fichier CSV si nécessaire
    app.run(debug=True)
