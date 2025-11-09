import json
import os
from datetime import datetime
import uuid

class Database:
    def __init__(self):
        self.data_dir = 'data'
        self.sessions_file = os.path.join(self.data_dir, 'sessions.json')
        self.evaluations_file = os.path.join(self.data_dir, 'evaluations.json')
        
        # Ensure data directory exists
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize data files
        self._initialize_data_files()
    
    def _initialize_data_files(self):
        """Initialize JSON data files if they don't exist"""
        if not os.path.exists(self.sessions_file):
            with open(self.sessions_file, 'w') as f:
                json.dump({}, f)
        
        if not os.path.exists(self.evaluations_file):
            with open(self.evaluations_file, 'w') as f:
                json.dump({}, f)
    
    def _read_json(self, filepath):
        """Read JSON data from file"""
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    def _write_json(self, filepath, data):
        """Write JSON data to file"""
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
    
    def create_session(self, session_data):
        """Create a new session record"""
        sessions = self._read_json(self.sessions_file)
        session_id = session_data['session_id']
        sessions[session_id] = session_data
        self._write_json(self.sessions_file, sessions)
        return session_id
    
    def get_session(self, session_id):
        """Get session by ID"""
        sessions = self._read_json(self.sessions_file)
        return sessions.get(session_id)
    
    def update_session_status(self, session_id, status):
        """Update session status"""
        sessions = self._read_json(self.sessions_file)
        if session_id in sessions:
            sessions[session_id]['status'] = status
            sessions[session_id]['updated_at'] = datetime.now().isoformat()
            self._write_json(self.sessions_file, sessions)
            return True
        return False
    
    def update_session_analysis(self, session_id, content, analysis):
        """Update session with presentation analysis"""
        sessions = self._read_json(self.sessions_file)
        if session_id in sessions:
            sessions[session_id]['content'] = content
            sessions[session_id]['analysis'] = analysis
            sessions[session_id]['updated_at'] = datetime.now().isoformat()
            self._write_json(self.sessions_file, sessions)
            return True
        return False
    
    def create_evaluation(self, evaluation_data):
        """Create a new evaluation record"""
        evaluations = self._read_json(self.evaluations_file)
        session_id = evaluation_data['session_id']
        evaluations[session_id] = evaluation_data
        self._write_json(self.evaluations_file, evaluations)
        return session_id
    
    def get_evaluation(self, session_id):
        """Get evaluation by session ID"""
        evaluations = self._read_json(self.evaluations_file)
        return evaluations.get(session_id)
    
    def add_transcript_entry(self, session_id, transcript):
        """Add transcript entry to evaluation"""
        evaluations = self._read_json(self.evaluations_file)
        if session_id in evaluations:
            if 'transcript' not in evaluations[session_id]:
                evaluations[session_id]['transcript'] = []
            
            evaluations[session_id]['transcript'].append({
                'text': transcript,
                'timestamp': datetime.now().isoformat()
            })
            
            evaluations[session_id]['updated_at'] = datetime.now().isoformat()
            self._write_json(self.evaluations_file, evaluations)
            return True
        return False
    
    def add_question_answer(self, session_id, question, answer):
        """Add question and answer to evaluation"""
        evaluations = self._read_json(self.evaluations_file)
        if session_id in evaluations:
            if 'questions_asked' not in evaluations[session_id]:
                evaluations[session_id]['questions_asked'] = []
            if 'answers_given' not in evaluations[session_id]:
                evaluations[session_id]['answers_given'] = []
            
            evaluations[session_id]['questions_asked'].append({
                'question': question,
                'timestamp': datetime.now().isoformat()
            })
            
            evaluations[session_id]['answers_given'].append({
                'answer': answer,
                'timestamp': datetime.now().isoformat()
            })
            
            evaluations[session_id]['updated_at'] = datetime.now().isoformat()
            self._write_json(self.evaluations_file, evaluations)
            return True
        return False
    
    def complete_evaluation(self, session_id, final_scores):
        """Complete evaluation with final scores"""
        evaluations = self._read_json(self.evaluations_file)
        sessions = self._read_json(self.sessions_file)
        
        if session_id in evaluations and session_id in sessions:
            # Update evaluation
            evaluations[session_id]['status'] = 'completed'
            evaluations[session_id]['final_scores'] = final_scores['scores']
            evaluations[session_id]['total_score'] = final_scores['total_score']
            evaluations[session_id]['feedback'] = final_scores.get('feedback', {})
            evaluations[session_id]['completed_at'] = datetime.now().isoformat()
            
            # Add student info from session
            evaluations[session_id]['roll_no'] = sessions[session_id]['roll_no']
            evaluations[session_id]['name'] = sessions[session_id]['name']
            
            # Update session status
            sessions[session_id]['status'] = 'completed'
            sessions[session_id]['updated_at'] = datetime.now().isoformat()
            
            self._write_json(self.evaluations_file, evaluations)
            self._write_json(self.sessions_file, sessions)
            return True
        return False
    
    def get_all_sessions(self):
        """Get all sessions"""
        return self._read_json(self.sessions_file)
    
    def get_all_evaluations(self):
        """Get all evaluations"""
        return self._read_json(self.evaluations_file)
    
    def delete_session(self, session_id):
        """Delete session and its evaluation"""
        sessions = self._read_json(self.sessions_file)
        evaluations = self._read_json(self.evaluations_file)
        
        deleted = False
        
        if session_id in sessions:
            del sessions[session_id]
            deleted = True
        
        if session_id in evaluations:
            del evaluations[session_id]
            deleted = True
        
        if deleted:
            self._write_json(self.sessions_file, sessions)
            self._write_json(self.evaluations_file, evaluations)
        
        return deleted