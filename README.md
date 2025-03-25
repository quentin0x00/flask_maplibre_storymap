# StoryMap

Une application minimaliste pour valoriser des données géo grâce à une storymap. Créée avec Flask et MapLibre ; déployée sur Heroku.

## Installation


### 1. Récupération du dépôt

Clonez le dépôt GitHub pour récupérer l'application :

```bash
$ git clone https://github.com/quentin0x00/storymap
```

### 2. Installation

Créez un environnement virtuel Python et installez Flask et ses dépendances :

```bash
#!/bin/bash

cd ~/storymap

python3 -m venv env
source env/bin/activate

pip install flask gunicorn
```
Ainsi que npm et maplibre dans le dossier /static (facultatif si vous passez par CDN) :
```bash
#!/bin/bash

cd app/static
npm install maplibre-gl

```

### 3. Démarrage du serveur

Lancez le serveur Guvicorn pour démarrer l'application (le serveur écoute par défaut sur le port 5000) :

```bash
$ cd app
$ gunicorn -w 4 -b 0.0.0.0:5000 app:app
```
Ou directement via Flask (en développement) :
```bash
$ cd app
$ python3 app.py
```

### 4. Notes

- `app.py` utilise ici un fichier CSV qui contient la totalité des données et des parametres des markers/encarts associés. Si vous avez davantages de données, je vous recommande de connecter une base Postgres (voir [documentation Flask](https://flask.palletsprojects.com/en/stable/)).
- Maplibre est ici installé via npm. Pour un usage immédiat, vous pouvez utiliser le CDN :
```js
<script src="https://unpkg.com/maplibre-gl@^5.2.0/dist/maplibre-gl.js"></script>
<link href="https://unpkg.com/maplibre-gl@^5.2.0/dist/maplibre-gl.css" rel="stylesheet"/>
```
