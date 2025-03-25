# StoryMap

Une application minimaliste pour valoriser des données géo grâce à une storymap. Créée avec Flask et MapLibre.

## Installation


### 1. Récupération du dépôt

Clonez le dépôt GitHub pour récupérer l'application :

```bash
$ git clone https://github.com/quentin0x00/flask_maplibre_storymap
```

### 2. Installation

Créez un environnement virtuel Python et installez Flask et Gunicorn :

```bash
#!/bin/bash

cd storymap/

python3 -m venv env
source env/bin/activate

pip install flask gunicorn
```

### 3. Démarrage du serveur

Lancez le serveur Gunicorn pour démarrer l'application :

```bash
cd app
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```
Ou directement via Flask (en développement) :
```bash
$ cd app
$ python3 app.py
```

## Notes

- `app.py` utilise ici un fichier CSV qui contient la totalité des données et des parametres des markers/encarts associés. Si vous avez davantages de données, je vous recommande de connecter une base Postgres (voir [documentation Flask](https://flask.palletsprojects.com/en/stable/)).