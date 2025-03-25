from flask import Flask, render_template, jsonify
import csv

app = Flask(__name__, static_folder='static')

CSV_FILE = 'data.csv'

def lire_csv():
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            return list(csv.DictReader(file))
    except FileNotFoundError:
        raise FileNotFoundError(f"{CSV_FILE} non trouvé.")
    except Exception as e:
        raise Exception(f"Erreur de lecture du CSV: {e}")

def service_data(rows):
    data = []
    for row in rows:
        data.append({
            'id': row['id'],
            'encart': {
                'title': row['title'],
                'role': row.get('role', ''),
                'date': row.get('date', ''),
                'content': row.get('content', ''),
                'skills': row.get('skills', '').split(';') if row.get('skills') else [],
                'link': row.get('link', ''),
                'link_alias': row.get('link_alias', ''),
            },
            'popup': {
                'title': row['title_popup'],
                'date': row.get('date', ''),
            },
            'geom': {
                'lng': float(row['longitude']),
                'lat': float(row['latitude'])
            },
            'param': {
                'img_url': row.get('url_img', ''),
                'img_fill_size': row['bg_size'],
                'border_color': row.get('border_color', ''),
                'zoom': row['zoom'],
                'pitch': row['pitch'],
                'speed': row['speed'],
                'bearing': row['bearing']
            }
        })

    return data



@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        rows = lire_csv()
        data = service_data(rows)
        return jsonify({'data': data})
    except FileNotFoundError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': f"Erreur /api/data: {e}"}), 500


if __name__ == '__main__':
    app.run(debug=True) 