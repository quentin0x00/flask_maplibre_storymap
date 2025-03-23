# StoryMap

Une application minimaliste pour valoriser des données géo grâce à une storymap. Créée avec Flask et MapLibre.

## Installation

### 1. Notes

- `app.py` utilise ici un fichier CSV qui contient la totalité des données et des parametres des markers/encarts associés. Peut être modifiées pour supporter d'autres formats (e.g. GeoJSON) ou se connecter à une base de données PostgreSQL (voir [documentation Flask](https://flask.palletsprojects.com/en/stable/)).
- Maplibre est ici récupéré via CDN pour un usage immédiat. Pour une installation locale, vous pouvez utiliser npm.

### 2. Récupération du dépôt

Clonez le dépôt GitHub pour récupérer l'application :

```bash
$ git clone https://github.com/quentin0x00/storymap
```

### 3. Installation minimale

Créez un environnement virtuel Python et installez Flask et ses dépendances :

```bash
#!/bin/bash

cd ~/storymap

python3 -m venv env
source env/bin/activate

pip install flask
```

### 4. Démarrage du serveur

Lancez le serveur Flask pour démarrer l'application (le serveur écoute par défaut sur le port 5000) :

```bash
$ python3 app.py
```

Vous pouvez ensuite accéder à l'application via http://localhost:5000.