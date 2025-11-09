# Project Summary

## Online Presentation Evaluator

A comprehensive AI-powered web application for evaluating student presentations in real-time through conversational AI interaction.

### 🎯 Key Features

1. **File Upload System**
   - Supports PPT, PPTX, and PDF formats
   - Secure file handling with validation
   - Student identification (roll number and name)

2. **AI-Powered Analysis**
   - OpenAI GPT-4 integration for content analysis
   - Automatic extraction of presentation content
   - Intelligent question generation based on content

3. **Real-Time Voice Interaction**
   - Live audio recording and processing
   - Speech-to-text conversion
   - Context-aware AI responses and questions

4. **Comprehensive Evaluation System**
   - 7 evaluation criteria with 100 total points
   - Detailed feedback for each category
   - Final score calculation with breakdown

### 📊 Evaluation Criteria

| Category | Points | Description |
|----------|--------|-------------|
| Project Content | 20 | Depth, relevance, correctness of the topic |
| Algorithm Used | 15 | Choice and justification of ML algorithms |
| Student Skill Level | 15 | Mastery of concepts, confidence, critical thinking |
| Slide Design & Visuals | 10 | Clarity, aesthetics, information delivery |
| Communication & Delivery | 20 | Oral presentation skill, engagement, flow |
| Handling of Questions | 10 | Ability to answer, clarity, adaptability |
| Research Process & Methodology | 10 | Approach, application, reproducibility |

### 🛠 Technology Stack

**Backend:**
- Flask (Python web framework)
- OpenAI GPT-4 API
- PyPDF2 (PDF processing)
- python-pptx (PowerPoint processing)
- SpeechRecognition (voice processing)

**Frontend:**
- HTML5, CSS3, JavaScript
- Bootstrap 5 for responsive design
- Web Audio API for recording
- Font Awesome for icons

**Data Storage:**
- JSON-based file storage
- Session management
- Evaluation history tracking

### 📁 Project Structure

```
presentation-evaluator/
├── app.py                    # Main Flask application
├── presentation_evaluator.py # AI evaluation logic
├── database.py              # Data management system
├── requirements.txt         # Python dependencies
├── setup.sh                 # Installation script
├── test_setup.py           # Setup verification script
├── .env.example            # Environment variables template
├── README.md               # Documentation
├── .gitignore              # Git ignore rules
├── templates/
│   └── index.html          # Main frontend interface
├── static/
│   └── app.js              # Frontend JavaScript logic
├── uploads/                # Uploaded presentation files
└── data/                   # Session and evaluation data
```

### 🚀 Getting Started

1. **Installation:**
   ```bash
   ./setup.sh
   ```

2. **Configuration:**
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key

3. **Run the application:**
   ```bash
   source venv/bin/activate
   python app.py
   ```

4. **Access:** http://localhost:5000

### 🔧 API Endpoints

- `POST /api/submit` - Upload presentation
- `GET /api/status/<session_id>` - Check processing status
- `POST /api/start-presentation/<session_id>` - Start evaluation
- `POST /api/audio-upload/<session_id>` - Upload audio for processing
- `POST /api/complete-evaluation/<session_id>` - Complete evaluation
- `GET /api/results/<session_id>` - Get evaluation results

### 💡 Key Components

1. **PresentationEvaluator Class**
   - Content extraction from presentations
   - AI-powered analysis and scoring
   - Speech-to-text processing
   - Response generation

2. **Database Class**
   - Session management
   - Evaluation data storage
   - JSON-based persistence

3. **Frontend Interface**
   - Drag-and-drop file upload
   - Real-time audio recording
   - Conversation display
   - Results visualization

### 🔒 Security Features

- File type validation
- Secure file handling
- Session-based authentication
- Input sanitization
- CORS configuration

### 📱 User Experience

- Intuitive drag-and-drop interface
- Real-time feedback during presentation
- Visual progress indicators
- Comprehensive results dashboard
- Responsive design for all devices

This project provides a complete solution for automated presentation evaluation with intelligent AI interaction, making it an ideal tool for educational institutions and assessment platforms.