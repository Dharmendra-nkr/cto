Everything — 3D React + Flask

A futuristic, interactive 3D smartphone landing page for the brand "Everything" built with React (Vite) and @react-three/fiber, and published with Flask. No backend logic — Flask only serves the static build.

Project structure
- app.py — Flask server that serves the React production build
- client/ — React app source (Vite)

Getting started
1) Install client dependencies and build the production site
   cd client
   npm install
   npm run build

2) Run the Flask server
   cd ..
   python3 app.py

3) Open http://localhost:5000 in your browser.

Development (optional)
- Run the Vite dev server for fast iteration
   cd client
   npm run dev

Tech highlights
- React 18 + Vite
- @react-three/fiber for WebGL integration
- @react-three/drei for helpers (controls, environment, soft shadows, materials)
- Procedurally modeled 3D phone with interactive orbit/tilt, glass + metal materials, subtle floating motion

Notes
- There is no backend. Flask serves the static assets from client/dist. You can deploy the Flask app to any platform that supports Python.
