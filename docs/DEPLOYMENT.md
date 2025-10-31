# Deployment

## Render.com

Backend
- Build: `pip install -r server/requirements.txt`
- Start: `gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 -b 0.0.0.0:5000 server.wsgi:app`
- Env vars: SECRET_KEY, DATABASE_URL, GEMINI_API_KEY, FLASK_ENV=production

Frontend
- Build: `npm install && npm run build`
- Publish: client/dist
- Env: VITE_API_URL, VITE_WS_URL

## AWS/Heroku/Docker
- See architecture notes; containerize backend and frontend separately
- Use Postgres in production; SQLite for development only
