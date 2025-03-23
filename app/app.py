from flask import Flask, render_template, jsonify
import csv

app = Flask(__name__, static_folder='static')

CSV_FILE = 'data.csv'

def service_data():
    encarts = []
    markers = []
    with open(CSV_FILE, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            encarts.append(extract_encarts(row))
            markers.append(extract_markers(row))
    return encarts, markers

def extract_encarts(row):
    return {
        'id': row['id'],
        'title': row['title'],
        'role': row.get('role', ''),
        'date': row.get('date', ''),
        'content': row.get('content', ''),
        'skills': row.get('skills', '').split(';') if row.get('skills') else [],
        'link': row.get('link', ''),
        'link_alias': row.get('link_alias', ''),
        'border_color': row.get('border_color', ''),
        'center': [float(row['longitude']), float(row['latitude'])],
        'zoom': row['zoom'],
        'pitch':row['pitch'],
        'speed':row['speed'],
        'bearing':row['bearing']
    }

def extract_markers(row):
    return {
        'id': row['id'],
        'lng': float(row['longitude']),
        'lat': float(row['latitude']),
        'url_img': row.get('url_img', ''),
        'border_color': row.get('border_color', ''),
        'bg_size': row['bg_size'],
        'title_popup' : row['title_popup'],
        'zoom': row['zoom'],
        'pitch':row['pitch'],
        'speed':row['speed'],
        'bearing':row['bearing'],
        'date':row['date']
    }


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        encarts, markers = service_data()
        return jsonify({'encarts': encarts, 'markers': markers})
    except FileNotFoundError:
        print(f"Le fichier {CSV_FILE} n'a pas été trouvé.")
        return jsonify({'encarts': [], 'markers': []}), 404
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier CSV: {e}")
        return jsonify({'encarts': [], 'markers': []}), 500


if __name__ == '__main__':
    app.run(debug=True)