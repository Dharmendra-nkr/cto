Backend — Flask API + Socket.IO

Run (development)
1) python3 -m venv venv && source venv/bin/activate
2) pip install -r requirements.txt
3) cp .env.example .env  # set GEMINI_API_KEY if available
4) python -c "from app import create_app, socketio; app=create_app('development'); socketio.run(app, host='0.0.0.0', port=5001)"

Structure
- app.py — Flask app factory and socketio init
- config.py — Config classes
- extensions.py — db, login_manager, socketio
- models/ — SQLAlchemy models
- routes/ — REST and WebSocket endpoints
- services/ — Gemini and audio processing
- schema.sql — SQL schema (reference)
