# Development Guide

## Git workflow
- main: always stable
- develop: integration branch
- feature branches: feature/<module-name>
- Conventional commits: feat(scope): description, fix(scope): description, etc.

## Backend
- Flask 3 + Flask-SocketIO + SQLAlchemy
- App factory in server/app.py
- Extensions in server/extensions.py
- Models in server/models/
- Routes in server/routes/
- Services in server/services/

### Running locally
- API + WebSocket: `python -m venv venv && source venv/bin/activate && pip install -r server/requirements.txt && python -c "from server.app import create_app, socketio; app=create_app(); socketio.run(app, host='0.0.0.0', port=5001)"`

## Frontend
- React 18 + Vite
- Feature folders in client/src/features
- WebSocket client in client/src/services/socketService.js
- Audio recorder hook in client/src/hooks/useAudioRecorder.js

### Env vars
- client: VITE_API_URL, VITE_WS_URL

## Coding standards
- Keep modules small and cohesive
- Avoid blocking calls in WebSocket handlers
- Validate and sanitize all network inputs
