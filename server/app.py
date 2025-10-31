from flask import Flask
from flask_cors import CORS
from .extensions import db, login_manager, socketio
from .routes.auth import auth_bp
from .routes.api import api_bp
# Import websocket handlers so event handlers register on socketio instance
from .routes import websocket  # noqa: F401
from .models.user import User


def create_app(env: str = 'development'):
    app = Flask(__name__)

    if env == 'production':
        from .config import ProductionConfig as Config
    else:
        from .config import DevelopmentConfig as Config

    app.config.from_object(Config)

    # Init extensions
    db.init_app(app)
    CORS(app, supports_credentials=True)

    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    @login_manager.user_loader
    def load_user(user_id):
        try:
            return User.query.get(int(user_id))
        except Exception:
            return None

    # Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()

    # Initialize socketio after app is ready
    socketio.init_app(app, cors_allowed_origins="*")

    return app


# Re-export for wsgi
__all__ = [
    'create_app',
    'socketio',
]


if __name__ == '__main__':
    application = create_app('development')
    socketio.run(application, host='0.0.0.0', port=5001, debug=True)
