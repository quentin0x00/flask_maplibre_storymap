from flask import Flask, render_template, jsonify
import csv


app = Flask(__name__, static_folder='static')


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    data = service_data()
    return jsonify(data)


CSV_FILE = 'data.csv'
def service_data():
    data = []
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                extract = {
                    'id': row['id'],
                    'title': row['title'],
                    'role': row.get('role', ''),
                    'date': row.get('date', ''),
                    'content': row.get('content', ''),
                    'skills': row.get('skills', '').split(';') if row.get('skills') else [],
                    'link': row.get('link', ''),
                    'link_alias': row.get('link_alias', ''),
                    'url_img': row.get('url_img', ''),
                    'border_color': row.get('border_color', ''),
                    'bearing': float(row.get('bearing', 0)),
                    'center': [float(row['longitude']), float(row['latitude'])],
                    'zoom': float(row.get('zoom', 16)),
                    'pitch': float(row.get('pitch', 0)),
                    'speed': float(row.get('speed', 1.0)),
                    'lng': float(row['longitude']),
                    'lat': float(row['latitude'])
                }
                data.append(extract)
    except FileNotFoundError:
        print(f"Le fichier {CSV_FILE} n'a pas été trouvé.")
    except Exception as e:
        print(f"Erreur lors de la lecture du fichier CSV: {e}")

    return data

if __name__ == '__main__':
    app.run(debug=True)
