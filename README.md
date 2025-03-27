# StoryMap

Une application minimaliste pour valoriser des données géo grâce à une storymap. Créée avec Flask et MapLibre.

Demo utilisant mon parcours pro : https://app.quentinrouquette.fr/

## Installation


### 1. Récupération du dépôt

Clonez le dépôt GitHub pour récupérer l'application :

```bash
$ git clone https://github.com/quentin0x00/flask_maplibre_storymap
```

### 2. Installation

Créez un environnement virtuel Python et installez Flask et Gunicorn :

```bash
cd storymap/

python3 -m venv env
source env/bin/activate

pip install flask gunicorn
```

### 3. Démarrage du serveur

Lancez le serveur Gunicorn pour démarrer l'application :

```bash
cd app
gunicorn app:app
```

## Notes

- `app.py` utilise ici un fichier CSV qui contient la totalité des données et des parametres des markers/encarts associés. Si vous avez davantage de données, je vous recommande d'utiliser Postgres avec SQLAlchemy (voir [documentation Flask-SQLAlchemy](https://flask-sqlalchemy.readthedocs.io/en/stable/quickstart/)).
