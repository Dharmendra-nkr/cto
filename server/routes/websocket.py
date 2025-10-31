import base64
import threading
import time
from flask import request
from flask_socketio import emit, join_room, leave_room
from ..extensions import socketio
from ..services.gemini_service import gemini_service
from ..services.audio_processor import transcribe_audio

# Store active presentation sessions in memory
active_sessions = {}


@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    emit('connection_response', {'status': 'connected'})


@socketio.on('start_presentation')
def handle_start_presentation(data):
    presentation_id = data.get('presentation_id')
    if not presentation_id:
        emit('error', {'message': 'Missing presentation_id'})
        return

    room = f'presentation_{presentation_id}'
    join_room(room)

    active_sessions[request.sid] = {
        'presentation_id': presentation_id,
        'room': room,
        'audio_buffer': [],
        'transcript': '',
        'current_slide': ''
    }

    emit('presentation_started', {
        'message': 'Presentation session initiated'
    }, room=room)


@socketio.on('audio_chunk')
def handle_audio_chunk(data):
    session = active_sessions.get(request.sid)
    if not session:
        return

    # Decode base64 audio chunk
    audio_b64 = data.get('audio')
    if not audio_b64:
        return

    # Some clients may send data URLs; strip prefix if present
    if ',' in audio_b64:
        audio_b64 = audio_b64.split(',')[1]

    try:
        audio_data = base64.b64decode(audio_b64)
    except Exception:
        return

    session['audio_buffer'].append(audio_data)

    # When buffer reaches threshold, process asynchronously
    if len(session['audio_buffer']) >= 10:  # ~2.5 seconds of audio depending on bitrate
        audio_bytes = b''.join(session['audio_buffer'])
        session['audio_buffer'] = []

        def process_audio():
            try:
                transcript = transcribe_audio(audio_bytes)
                session['transcript'] += (transcript + ' ')

                slide_image = session.get('current_slide', '')

                analysis = gemini_service.analyze_real_time(
                    transcript,
                    slide_image
                )

                emit('live_score_update', {
                    'scores': {
                        'content': analysis.get('content_score', 0),
                        'delivery': analysis.get('delivery_score', 0),
                        'engagement': analysis.get('engagement_score', 0)
                    }
                }, room=session['room'])

                if analysis.get('question'):
                    emit('ai_question', {
                        'question': analysis['question'],
                        'timestamp': time.time()
                    }, room=session['room'])
            except Exception as e:
                emit('error', {'message': f'Processing error: {str(e)}'})

        threading.Thread(target=process_audio, daemon=True).start()
        emit('audio_received', {'status': 'processing'})


@socketio.on('slide_image')
def handle_slide_image(data):
    session = active_sessions.get(request.sid)
    if not session:
        return

    image_data = data.get('image', '')
    session['current_slide'] = image_data
    emit('slide_updated', {'status': 'received'})


@socketio.on('end_presentation')
def handle_end_presentation():
    session = active_sessions.get(request.sid)
    if session:
        leave_room(session['room'])
        emit('presentation_ended', {
            'message': 'Generating final report'
        }, room=session['room'])
        del active_sessions[request.sid]


@socketio.on('disconnect')
def handle_disconnect():
    if request.sid in active_sessions:
        del active_sessions[request.sid]
    print(f'Client disconnected: {request.sid}')
