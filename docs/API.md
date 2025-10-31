# API and WebSocket Contracts

## REST Endpoints

- POST /api/auth/signup
  - Body: { username, email, password, role }
  - 201, 400

- POST /api/auth/login
  - Body: { email, password }
  - 200, 401

- GET /api/presentations
  - Auth: required
  - Returns list of presentations for current user (student) or all (staff)

- POST /api/presentations
  - Auth: required
  - Body: { title }
  - Returns { presentation_id }

- PUT /api/marks/:id
  - Auth: staff
  - Body: { content_score, delivery_score, engagement_score, staff_comments }
  - Returns { message }

- GET /api/students/presentations
  - Auth: staff
  - Returns student list with presentations and marks

- GET /api/transcripts/:presentation_id
  - Auth: required
  - Returns { transcript }

## WebSocket Events (Socket.IO)

- connect → connection_response { status: 'connected' }

- Client → start_presentation { presentation_id }
  - Server → presentation_started { message }

- Client → audio_chunk { audio: base64 }
  - Server → audio_received { status: 'processing' }
  - Server → live_score_update { scores: { content, delivery, engagement } }
  - Server → ai_question { question, timestamp }

- Client → slide_image { image: base64 data URL }
  - Server → slide_updated { status }

- Client → end_presentation
  - Server → presentation_ended { message }
