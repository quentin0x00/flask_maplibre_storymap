from flask import Flask, render_template, jsonify
from werkzeug.middleware.proxy_fix import ProxyFix
import csv

app = Flask(__name__, static_folder='static')
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

CSV_FILE = 'data.csv'

def lire_csv():
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            return list(csv.DictReader(file))
    except FileNotFoundError:
        raise FileNotFoundError(f"{CSV_FILE} non trouvé.")
    except Exception as e:
        app.logger.error(f"Erreur de lecture du CSV: {e}")
        raise

def service_data(rows):
    data = []
    champs_obligatoires = {'id', 'longitude', 'latitude'}
    for row in rows:
        if not all(champ in row for champ in champs_obligatoires):
            app.logger.warning(f"Champs obligatoires ('id', 'longitude', 'latitude') non satisfaits. Ligne ignorée: {row}")
            continue
            
        try:
            data.append({
                'id': str(row['id']),
                'encart': {
                    'title': str(row.get('title', '')),
                    'role': str(row.get('role', '')),
                    'date': str(row.get('date', '')),
                    'content': str(row.get('content', '')),
                    'skills': [s.strip() for s in row.get('skills', '').split(';') if s.strip()],
                    'link': str(row.get('link', '')),
                    'link_alias': str(row.get('link_alias', '')),
                },
                'popup': {
                    'title': str(row.get('title_popup','')),
                    'date': str(row.get('date', '')),
                },
                'geom': {
                    'lng': float(row['longitude']),
                    'lat': float(row['latitude'])
                },
                'param': {
                    'img_url': str(row.get('url_img', '')),
                    'img_fill_size': str(row.get('bg_size', '100%')),
                    'border_color': str(row.get('border_color', '#000000')),
                    'zoom': float(row.get('zoom', 14)),
                    'pitch': float(row.get('pitch', 0)),
                    'speed': float(row.get('speed', 1.2)),
                    'bearing': float(row.get('bearing', 0))
                }
            })
        except (ValueError, TypeError) as e:
            app.logger.error(f"Erreur de format des données: {e} - Ligne: {row}")
            continue
            
    return data


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        rows = lire_csv()
        data = service_data(rows)
        response = jsonify({'data': data})
        return response
    except FileNotFoundError as e:
        app.logger.error(str(e))
        return jsonify({'error': 'Données non disponibles'}), 404
    except Exception as e:
        app.logger.error(f"Erreur API: {e}")
        return jsonify({'error': 'Erreur serveur'}), 500


if __name__ == '__main__':
    app.run(debug=False) 