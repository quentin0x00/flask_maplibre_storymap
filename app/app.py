from flask import Flask, render_template
import csv
import os
import json

app = Flask(__name__)

CSV_FILE = 'data.csv'

def load_data_from_csv():

    encarts = {}
    encart_content = []
    markers = []

    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                encart_id = row['id']
                encarts[encart_id] = {
                    'bearing': float(row['bearing']),
                    'center': [float(row['longitude']), float(row['latitude'])],
                    'zoom': float(row['zoom']),
                    'pitch': float(row.get('pitch', 0)),
                    'speed': float(row.get('speed', 1.0))
                }
                encart_content.append({
                    'id': encart_id,
                    'title': row['title'],
                    'role': row.get('role', ''),
                    'date': row.get('date', ''),
                    'content': row.get('content', ''),
                    'skills': row.get('skills', ''),
                    'link': row.get('link', ''),
                    'link_alias': row.get('link_alias', ''),
                    'url_img': row.get('url_img', ''),
                    'border_color': row.get('border_color', '')
                })
                markers.append({
                    'id': encart_id,
                    'lng': float(row['longitude']),
                    'lat': float(row['latitude']),
                    'title': row['title'],
                    'url_img': row.get('url_img', ''),
                    'border_color': row.get('border_color', '')
                })
    except FileNotFoundError:
        print(f"Le fichier {CSV_FILE} n'a pas été trouvé.")
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier CSV: {e}")

    return encarts, encart_content, markers

@app.route('/')
def index():
    encarts, encart_content, markers = load_data_from_csv()
    encarts_json = json.dumps(encarts)
    markers_json = json.dumps(markers)

    return render_template('index.html',
                           encarts_json=encarts_json,
                           encart_content=encart_content,
                           markers_json=markers_json)

def create_csv_if_not_exists():
    if not os.path.exists(CSV_FILE):
        try:
            with open(CSV_FILE, 'w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerow(['id', 'title', 'role', 'date', 'content', 'skills', 'bearing', 'longitude', 'latitude', 'zoom', 'pitch', 'speed', 'link', 'link_alias', 'url_img', 'border_color'])
                writer.writerows([
                    ['0', 'Bonjour ! 👋', "Géomaticien basé sur Nantes.", "", "J'administre un SGBD spatial, automatise les traitements, et gère un portail web-cartographique.","PostgreSQL ; Python ; GeoServer ; Qgis ; Gdal/Ogr ; Vmap ; Maplibre ; Flask", '0', '-1.553603493340308', '47.218599718064844', '16', '60', '1.3', '', '', '/static/img/moi.png', '#C84D82'],
                    ['1', 'Abei Energy ⚡️', "Chargé d'études SIG (cdi - poste actuel)", "02|2023 - Présent", '> Automatisation du traitement de données  ; > Développement et maintenance du webSIG de l\'entreprise', "PostgreSQL ; Python ; GeoServer ; Qgis ; Gdal/Ogr ; Vmap ; Git ; Docker",'0', '-3.6914852859185343', '40.42880022606314', '16', '60', '1.3', 'https://abeienergy.fr/', 'Abei Energy 🌐', '/static/img/abei.png', '#F4A261'],
                    ['2', 'Thema Environnement 🌱', "Géomaticien (cdd - 6 mois)", "05|2022 - 11|2022", '> Traitement de données; > Analyses spatiales; > Atlas et cartographies', "PostgreSQL; Qgis ; Arcgis ; Gdal; Adobe Illustrator", '0', '-1.1857005797117022', '47.40885995562285', '16', '60', '1.3', 'https://www.thema-environnement.fr/', 'Thema Environnement 🌐', '/static/img/thema.png', '#37A77B'],
                    ['3', 'GIP Littoral 🌊', "Chargé d'études SIG (cdd - 6 mois & stage - 6 mois)", "03|2021 - 04|2022", '> Traitement de données; > Analyses spatiales; > Atlas et cartographies', "PostgreSQL; Qgis ; Gdal; Adobe Illustrator", '0', '-0.5513001527871958', '44.82764741819648', '16', '60', '1.3', 'https://www.giplittoral.fr/', 'Gip Littoral 🌐', '/static/img/gip.png', '#4575D4'],
                    ['4', 'Université de Nantes IGARUN 📚', "Master 2 - SIG", "09|2016 - 09|2021", '> Traitement de données; > Analyses spatiales; > Atlas et cartographies', "PostgreSQL; Python ; Qgis ; Adobe Illustrator", '0', '-1.5492718817522353', '47.24614588519798', '16', '60', '1.3', 'https://www.univ-nantes.fr/', 'Université de Nantes 🌐', '/static/img/un.png', '#87a7fa']
                ])
            print(f"Fichier {CSV_FILE} créé avec des données d'exemple.")
        except Exception as e:
            print(f"Erreur lors de la création du fichier CSV : {e}")

if __name__ == '__main__':
    create_csv_if_not_exists()
    app.run(debug=True)
