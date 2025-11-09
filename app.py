import os
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import openai
from werkzeug.utils import secure_filename
import tempfile
import shutil
from datetime import datetime
import json
import uuid
import threading
import asyncio
from presentation_evaluator import PresentationEvaluator
from database import Database

app = Flask(__name__)
CORS(app)

# Configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('static', exist_ok=True)
os.makedirs('templates', exist_ok=True)

# Initialize OpenAI
client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize database and evaluator
db = Database()
evaluator = PresentationEvaluator(client)

# Allowed file extensions
ALLOWED_EXTENSIONS = {'ppt', 'pptx', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/submit', methods=['POST'])
def submit_presentation():
    try:
        # Get student information
        roll_no = request.form.get('roll_no')
        name = request.form.get('name')
        
        if not roll_no or not name:
            return jsonify({'error': 'Roll number and name are required'}), 400
        
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Only PPT, PPTX, and PDF files are allowed'}), 400
        
        # Save the file
        filename = secure_filename(file.filename)
        session_id = str(uuid.uuid4())
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{session_id}_{filename}")
        file.save(file_path)
        
        # Create session record
        session_data = {
            'session_id': session_id,
            'roll_no': roll_no,
            'name': name,
            'file_path': file_path,
            'filename': filename,
            'status': 'uploaded',
            'created_at': datetime.now().isoformat()
        }
        
        db.create_session(session_data)
        
        # Start processing the presentation in background
        threading.Thread(target=process_presentation, args=(session_id, file_path)).start()
        
        return jsonify({
            'session_id': session_id,
            'message': 'Presentation uploaded successfully. Processing...',
            'status': 'uploaded'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def process_presentation(session_id, file_path):
    try:
        # Update status to processing
        db.update_session_status(session_id, 'processing')
        
        # Extract content from presentation
        content = evaluator.extract_presentation_content(file_path)
        
        # Analyze content and generate evaluation criteria
        analysis = evaluator.analyze_presentation(content)
        
        # Update session with analysis
        db.update_session_analysis(session_id, content, analysis)
        
        # Update status to ready
        db.update_session_status(session_id, 'ready')
        
    except Exception as e:
        db.update_session_status(session_id, f'error: {str(e)}')

@app.route('/api/status/<session_id>')
def get_status(session_id):
    session = db.get_session(session_id)
    if not session:
        return jsonify({'error': 'Session not found'}), 404
    
    return jsonify({
        'session_id': session_id,
        'status': session['status'],
        'analysis': session.get('analysis'),
        'content': session.get('content')
    })

@app.route('/api/start-presentation/<session_id>', methods=['POST'])
def start_presentation(session_id):
    session = db.get_session(session_id)
    if not session:
        return jsonify({'error': 'Session not found'}), 404
    
    if session['status'] != 'ready':
        return jsonify({'error': 'Presentation not ready for evaluation'}), 400
    
    # Initialize evaluation session
    evaluation_data = {
        'session_id': session_id,
        'status': 'started',
        'start_time': datetime.now().isoformat(),
        'current_slide': 0,
        'transcript': [],
        'scores': {},
        'questions_asked': [],
        'answers_given': []
    }
    
    db.create_evaluation(evaluation_data)
    
    return jsonify({
        'message': 'Presentation evaluation started',
        'first_instruction': 'Please begin your presentation. I will be listening and evaluating you in real-time.'
    })

@app.route('/api/audio-upload/<session_id>', methods=['POST'])
def upload_audio(session_id):
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        
        # Save audio temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as tmp_file:
            audio_file.save(tmp_file.name)
            
            # Process audio - convert speech to text
            transcript = evaluator.speech_to_text(tmp_file.name)
            
            # Add to transcript
            db.add_transcript_entry(session_id, transcript)
            
            # Generate AI response or question
            response = evaluator.generate_response(transcript, session_id)
            
            # Clean up
            os.unlink(tmp_file.name)
            
            return jsonify({
                'transcript': transcript,
                'response': response,
                'continue': True
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/complete-evaluation/<session_id>', methods=['POST'])
def complete_evaluation(session_id):
    try:
        # Get all evaluation data
        evaluation = db.get_evaluation(session_id)
        session = db.get_session(session_id)
        
        if not evaluation or not session:
            return jsonify({'error': 'Evaluation session not found'}), 404
        
        # Generate final scores and feedback
        final_scores = evaluator.calculate_final_scores(evaluation, session)
        
        # Update evaluation with final results
        db.complete_evaluation(session_id, final_scores)
        
        return jsonify({
            'message': 'Evaluation completed successfully',
            'scores': final_scores,
            'total_score': sum(final_scores.values())
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/results/<session_id>')
def get_results(session_id):
    evaluation = db.get_evaluation(session_id)
    if not evaluation or evaluation.get('status') != 'completed':
        return jsonify({'error': 'Results not available'}), 404
    
    return jsonify({
        'session_id': session_id,
        'student_info': {
            'roll_no': evaluation.get('roll_no'),
            'name': evaluation.get('name')
        },
        'scores': evaluation.get('final_scores'),
        'total_score': evaluation.get('total_score'),
        'feedback': evaluation.get('feedback'),
        'completed_at': evaluation.get('completed_at')
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)