# Presentation Evaluator

An AI-powered online presentation evaluation system that allows students to submit their presentations (PPT/PPTX/PDF) and receive real-time evaluation through an intelligent conversational agent.

## Features

- **File Upload**: Students can upload PowerPoint or PDF presentations
- **AI Analysis**: Automatic content analysis using OpenAI GPT-4
- **Real-time Conversation**: Voice interaction with AI evaluator during presentation
- **Intelligent Questions**: Context-aware questions about algorithms, methodology, and concepts
- **Comprehensive Scoring**: Detailed evaluation across 7 criteria with 100 points total
- **Instant Feedback**: Detailed feedback and suggestions for improvement

## Evaluation Criteria

1. **Project Content** (20 points) - Depth, relevance, correctness of the topic
2. **Algorithm Used** (15 points) - Choice and justification of ML algorithms  
3. **Student Skill Level** (15 points) - Mastery of concepts, confidence, and critical thinking
4. **Slide Design & Visuals** (10 points) - Clarity, aesthetics, and information delivery
5. **Communication & Delivery** (20 points) - Oral presentation skill, engagement, flow
6. **Handling of Questions** (10 points) - Ability to answer, clarity, and adaptability
7. **Research Process & Methodology** (10 points) - Approach, application, reproducibility

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **AI**: OpenAI GPT-4 for content analysis and conversation
- **Speech Recognition**: Web Speech API + Google Speech Recognition
- **File Processing**: PyPDF2 (PDF), python-pptx (PowerPoint)
- **Storage**: JSON-based file storage

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. Run the application:
   ```bash
   python app.py
   ```

5. Open http://localhost:5000 in your browser

## Usage

1. **Student Registration**: Enter roll number and name
2. **Upload Presentation**: Submit PPT/PPTX or PDF file
3. **Processing**: AI analyzes the presentation content
4. **Start Presentation**: Begin live presentation session
5. **Voice Interaction**: Speak naturally while AI evaluates and asks questions
6. **Complete Evaluation**: Receive detailed scores and feedback

## API Endpoints

- `POST /api/submit` - Upload presentation
- `GET /api/status/<session_id>` - Check processing status
- `POST /api/start-presentation/<session_id>` - Start evaluation
- `POST /api/audio-upload/<session_id>` - Upload audio for processing
- `POST /api/complete-evaluation/<session_id>` - Complete evaluation
- `GET /api/results/<session_id>` - Get evaluation results

## File Structure

```
├── app.py                    # Main Flask application
├── presentation_evaluator.py # AI evaluation logic
├── database.py              # Data management
├── requirements.txt         # Python dependencies
├── .env.example            # Environment variables template
├── templates/
│   └── index.html          # Main frontend template
├── static/
│   └── app.js              # Frontend JavaScript
├── uploads/                # Uploaded presentation files
└── data/                  # Session and evaluation data
```

## Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `FLASK_ENV` - Environment (development/production)
- `UPLOAD_FOLDER` - Upload directory path
- `MAX_CONTENT_LENGTH` - Maximum file size in bytes

## Notes

- Ensure microphone permissions are granted for voice interaction
- File size limit: 16MB
- Supported formats: PPT, PPTX, PDF
- Requires internet connection for AI processing

## License

MIT License