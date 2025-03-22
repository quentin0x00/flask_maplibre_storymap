from flask import Flask, render_template
import csv
import os
import json

app = Flask(__name__)

CSV_FILE = 'data.csv'

@app.route('/')
def index():
    chapters = {}
    chapter_content = []
    markers = []

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
                'content': row['content']
            })
            markers.append({
                'id': chapter_id,
                'lng': float(row['longitude']),
                'lat': float(row['latitude']),
                'title': row['title']
            })

    chapters_json = json.dumps(chapters)
    markers_json = json.dumps(markers)
    return render_template('index.html',
                        chapters_json=chapters_json,
                        chapter_content=chapter_content,
                        markers_json=markers_json)


if __name__ == '__main__':
    # Créer un exemple de fichier CSV si celui-ci n'existe pas
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['id', 'title', 'content', 'bearing', 'longitude', 'latitude', 'zoom', 'pitch', 'speed'])
            writer.writerow(['baker', '221b Baker St.', 'November 1895. London is shrouded in fog and Sherlock Holmes and Watson pass time restlessly awaiting a new case.', '27', '-0.15591514', '51.51830379', '15.5', '20', '1.0'])
            writer.writerow(['aldgate', 'Aldgate Station', 'Arthur Cadogan West was found dead, head crushed in on train tracks at Aldgate Station at 6AM Tuesday morning.', '150', '-0.07571203', '51.51424049', '15', '0', '1.0'])
            writer.writerow(['paris', 'Eiffel Tower', 'The Eiffel Tower is an iconic symbol of Paris, attracting nearly 7 million visitors each year.', '0', '2.294481', '48.858370', '15', '0', '1.0'])
            writer.writerow(['newyork', 'Statue of Liberty', 'The Statue of Liberty is a symbol of freedom and democracy, standing tall in New York Harbor.', '90', '-74.044502', '40.689247', '15', '20', '1.0'])
            writer.writerow(['tokyo', 'Shibuya Crossing', 'Shibuya Crossing is one of the busiest intersections in the world, located in Tokyo.', '180', '139.691711', '35.658581', '15', '0', '1.0'])
            writer.writerow(['sydney', 'Opera House', 'The Sydney Opera House is a multi-venue performing arts centre, famous for its unique design.', '270', '151.215297', '-33.856784', '15', '20', '1.0'])
            writer.writerow(['rio', 'Christ the Redeemer', 'Christ the Redeemer is a colossal statue of Jesus Christ, overlooking the city of Rio de Janeiro.', '0', '-43.210487', '-22.951916', '15', '0', '1.0'])

    app.run(debug=True)
