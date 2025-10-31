AI Presentation Evaluation Agent (Team ECHO)

Overview
An intelligent system that evaluates student presentations in real-time using multimodal AI analysis (audio + slides), providing instant feedback and structured assessments.

Key features
- Real-time audio streaming and transcription
- Slide content analysis via multimodal AI
- Live scoring on content, delivery, and engagement metrics
- AI-generated probing questions during presentation
- Automated final report with strengths and improvements
- Staff dashboard for mark review and editing

Monorepo layout
- server/ — Flask API, WebSocket, models, Gemini integration
- client/ — React app (Vite) with feature-based folders (auth, presentation, dashboard)
- docs/ — Specs and handbooks

Quick start
Backend (development)
1) cd server
2) python3 -m venv venv && source venv/bin/activate
3) pip install -r requirements.txt
4) export FLASK_APP=app.py
5) python -c "from app import create_app; from extensions import socketio; app=create_app(); socketio.run(app, host='0.0.0.0', port=5001)"

Frontend (development)
1) cd client
2) npm install
3) echo "VITE_API_URL=http://localhost:5001" > .env.local
4) echo "VITE_WS_URL=http://localhost:5001" >> .env.local
5) npm run dev

Production (Render)
- See docs/DEPLOYMENT.md for detailed steps and env vars

Team agents
- Suriya Prakash A — UI/UX Design & Frontend
- Vishnuvaradhan M — Frontend Architecture & WebSocket
- Dharmendra NKR — AI Engineering
- Krithik Eswaran M — Core Logic & API Integration
- Karthick Prasanna P — Backend & Database

Notes
- The existing root Flask app (app.py) serves the current 3D landing page. The new backend lives under server/ and can be run independently on port 5001 for development.
