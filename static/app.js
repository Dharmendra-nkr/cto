class PresentationEvaluator {
    constructor() {
        this.currentSessionId = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.evaluationActive = false;
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // File upload
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                this.updateFileName(files[0].name);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.updateFileName(e.target.files[0].name);
            }
        });
        
        // Form submission
        document.getElementById('uploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.uploadPresentation();
        });
        
        // Recording controls
        document.getElementById('startRecording').addEventListener('click', () => {
            this.startRecording();
        });
        
        document.getElementById('stopRecording').addEventListener('click', () => {
            this.stopRecording();
        });
        
        // Complete evaluation
        document.getElementById('completeEvaluation').addEventListener('click', () => {
            this.completeEvaluation();
        });
        
        // New evaluation
        document.getElementById('newEvaluation').addEventListener('click', () => {
            this.resetToUpload();
        });
    }
    
    updateFileName(fileName) {
        document.getElementById('fileName').innerHTML = `
            <i class="fas fa-file"></i> <strong>${fileName}</strong>
        `;
    }
    
    async uploadPresentation() {
        const formData = new FormData();
        formData.append('roll_no', document.getElementById('rollNo').value);
        formData.append('name', document.getElementById('studentName').value);
        formData.append('file', document.getElementById('fileInput').files[0]);
        
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.currentSessionId = result.session_id;
                this.showStatusSection();
                this.pollStatus(result.session_id);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError('Network error: ' + error.message);
        }
    }
    
    showStatusSection() {
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('statusSection').style.display = 'block';
        this.updateStatus('uploaded', 'Processing your presentation...');
    }
    
    updateStatus(status, message) {
        const indicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        const statusMessage = document.getElementById('statusMessage');
        const progressBar = document.getElementById('progressBar');
        
        // Remove all status classes
        indicator.className = 'status-indicator';
        
        // Add appropriate status class
        indicator.classList.add(`status-${status}`);
        
        statusText.textContent = message;
        statusMessage.textContent = message;
        
        // Update progress bar
        const progressMap = {
            'uploaded': 25,
            'processing': 50,
            'ready': 75,
            'started': 90,
            'completed': 100
        };
        
        progressBar.style.width = `${progressMap[status] || 0}%`;
    }
    
    async pollStatus(sessionId) {
        try {
            const response = await fetch(`/api/status/${sessionId}`);
            const result = await response.json();
            
            if (response.ok) {
                this.updateStatus(result.status, this.getStatusMessage(result.status));
                
                if (result.status === 'ready') {
                    // Show start presentation button
                    document.getElementById('statusMessage').innerHTML = `
                        <div class="text-center">
                            <h5>Your presentation is ready for evaluation!</h5>
                            <button class="btn btn-success btn-lg" onclick="app.startPresentation()">
                                <i class="fas fa-play"></i> Start Presentation
                            </button>
                        </div>
                    `;
                } else if (result.status === 'error') {
                    this.showError('Processing failed: ' + result.status);
                } else if (result.status !== 'completed') {
                    // Continue polling
                    setTimeout(() => this.pollStatus(sessionId), 3000);
                }
            }
        } catch (error) {
            console.error('Status polling error:', error);
            setTimeout(() => this.pollStatus(sessionId), 5000);
        }
    }
    
    getStatusMessage(status) {
        const messages = {
            'uploaded': 'Presentation uploaded successfully',
            'processing': 'Analyzing presentation content...',
            'ready': 'Presentation analysis complete',
            'started': 'Presentation evaluation in progress',
            'completed': 'Evaluation completed successfully',
            'error': 'Processing failed'
        };
        return messages[status] || 'Processing...';
    }
    
    async startPresentation() {
        try {
            const response = await fetch(`/api/start-presentation/${this.currentSessionId}`, {
                method: 'POST'
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.showEvaluationInterface(result.first_instruction);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError('Failed to start presentation: ' + error.message);
        }
    }
    
    showEvaluationInterface(firstInstruction) {
        document.getElementById('statusSection').style.display = 'none';
        document.getElementById('evaluationSection').style.display = 'block';
        
        // Display first instruction from agent
        this.addAgentMessage(firstInstruction);
        
        // Load session info
        this.loadSessionInfo();
        
        this.evaluationActive = true;
    }
    
    loadSessionInfo() {
        const sessionInfo = document.getElementById('sessionInfo');
        sessionInfo.innerHTML = `
            <p><strong>Session ID:</strong> ${this.currentSessionId}</p>
            <p><strong>Roll Number:</strong> ${document.getElementById('rollNo').value}</p>
            <p><strong>Name:</strong> ${document.getElementById('studentName').value}</p>
            <p><strong>Status:</strong> <span class="badge bg-success">Active</span></p>
        `;
    }
    
    addAgentMessage(message) {
        const conversationHistory = document.getElementById('conversationHistory');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'agent-message';
        messageDiv.innerHTML = `
            <i class="fas fa-robot"></i> ${message}
        `;
        conversationHistory.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addStudentMessage(message) {
        const conversationHistory = document.getElementById('conversationHistory');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'student-message';
        messageDiv.innerHTML = `
            <i class="fas fa-user"></i> ${message}
        `;
        conversationHistory.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    scrollToBottom() {
        const transcriptBox = document.getElementById('transcriptBox');
        transcriptBox.scrollTop = transcriptBox.scrollHeight;
    }
    
    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                this.audioChunks.push(event.data);
            });
            
            this.mediaRecorder.addEventListener('stop', () => {
                this.processAudio();
            });
            
            this.mediaRecorder.start();
            this.isRecording = true;
            
            // Update UI
            document.getElementById('startRecording').style.display = 'none';
            document.getElementById('stopRecording').style.display = 'inline-block';
            document.getElementById('recordingStatus').className = 'badge bg-danger recording';
            document.getElementById('recordingStatus').textContent = 'Recording...';
            
        } catch (error) {
            this.showError('Microphone access denied: ' + error.message);
        }
    }
    
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            // Update UI
            document.getElementById('startRecording').style.display = 'inline-block';
            document.getElementById('stopRecording').style.display = 'none';
            document.getElementById('recordingStatus').className = 'badge bg-secondary';
            document.getElementById('recordingStatus').textContent = 'Not Recording';
            
            // Stop all tracks
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    }
    
    async processAudio() {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
        
        try {
            const response = await fetch(`/api/audio-upload/${this.currentSessionId}`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.addStudentMessage(result.transcript);
                this.addAgentMessage(result.response);
                
                if (!result.continue) {
                    this.completeEvaluation();
                }
            } else {
                this.showError('Audio processing failed: ' + result.error);
            }
        } catch (error) {
            this.showError('Network error: ' + error.message);
        }
    }
    
    async completeEvaluation() {
        if (!this.evaluationActive) return;
        
        this.evaluationActive = false;
        
        // Stop recording if active
        if (this.isRecording) {
            this.stopRecording();
        }
        
        try {
            const response = await fetch(`/api/complete-evaluation/${this.currentSessionId}`, {
                method: 'POST'
            });
            
            const result = await response.json();
            
            if (response.ok) {
                this.showResults(result);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            this.showError('Failed to complete evaluation: ' + error.message);
        }
    }
    
    showResults(results) {
        document.getElementById('evaluationSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        
        // Update total score
        document.getElementById('totalScore').textContent = `${results.total_score}/100`;
        
        // Update score breakdown
        const scoreBreakdown = document.getElementById('scoreBreakdown');
        scoreBreakdown.innerHTML = '';
        
        const maxScores = {
            'Project Content': 20,
            'Algorithm Used': 15,
            'Student Skill Level': 15,
            'Slide Design & Visuals': 10,
            'Communication & Delivery': 20,
            'Handling of Questions': 10,
            'Research Process & Methodology': 10
        };
        
        for (const [category, score] of Object.entries(results.scores)) {
            const maxScore = maxScores[category] || 0;
            const percentage = (score / maxScore) * 100;
            
            const scoreCard = document.createElement('div');
            scoreCard.className = 'col-md-6 mb-3';
            scoreCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">${category}</h6>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="score-value">${score}/${maxScore}</span>
                            <span class="badge bg-${this.getScoreColor(percentage)}">${percentage.toFixed(0)}%</span>
                        </div>
                        <div class="progress mt-2">
                            <div class="progress-bar bg-${this.getScoreColor(percentage)}" 
                                 role="progressbar" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </div>
            `;
            scoreBreakdown.appendChild(scoreCard);
        }
        
        // Update feedback
        const feedbackSection = document.getElementById('feedbackSection');
        if (results.feedback && typeof results.feedback === 'object') {
            let feedbackHTML = '';
            for (const [category, feedback] of Object.entries(results.feedback)) {
                if (category !== 'error') {
                    feedbackHTML += `
                        <div class="alert alert-light">
                            <strong>${category}:</strong> ${feedback}
                        </div>
                    `;
                }
            }
            feedbackSection.innerHTML = feedbackHTML;
        }
    }
    
    getScoreColor(percentage) {
        if (percentage >= 80) return 'success';
        if (percentage >= 60) return 'info';
        if (percentage >= 40) return 'warning';
        return 'danger';
    }
    
    showError(message) {
        // Create error alert
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        errorDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(errorDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    resetToUpload() {
        // Reset all forms and variables
        this.currentSessionId = null;
        this.evaluationActive = false;
        
        // Reset form
        document.getElementById('uploadForm').reset();
        document.getElementById('fileName').innerHTML = '';
        
        // Hide all sections except upload
        document.getElementById('uploadSection').style.display = 'block';
        document.getElementById('statusSection').style.display = 'none';
        document.getElementById('evaluationSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        
        // Clear conversation
        document.getElementById('conversationHistory').innerHTML = '';
    }
}

// Initialize the app
const app = new PresentationEvaluator();