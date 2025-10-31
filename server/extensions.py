from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_socketio import SocketIO

# Shared extensions

db = SQLAlchemy()
login_manager = LoginManager()
# Use gevent for async WebSocket workers
socketio = SocketIO(cors_allowed_origins="*", async_mode="gevent")
