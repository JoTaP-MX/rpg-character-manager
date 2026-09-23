import os
from flask import Flask, jsonify
from .config import Config
from .extensions import db

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    os.makedirs(app.instance_path, exist_ok=True)

    db.init_app(app)

    from app.routes.folders import folders_bp
    app.register_blueprint(folders_bp)

    @app.route('/api/ping')
    def ping():
        return jsonify({'status': 'ok'})

    return app
