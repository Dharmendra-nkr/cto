import React, { useState, useEffect, useRef } from 'react';
import socketService from '../../services/socketService';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import api from '../../services/apiClient';

const PresentationView = () => {
  const [presentationId, setPresentationId] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [scores, setScores] = useState({ content: 0, delivery: 0, engagement: 0 });
  const [aiQuestions, setAiQuestions] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const fileInputRef = useRef(null);

  useEffect(() => {
    socketService.connect();

    socketService.onScoreUpdate((data) => {
      setScores(data.scores);
    });

    socketService.onAIQuestion((data) => {
      setAiQuestions((prev) => [
        ...prev,
        { question: data.question, timestamp: data.timestamp },
      ]);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSlides((prev) => [
          ...prev,
          { id: index, data: e.target.result, name: file.name },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const startPresentation = async () => {
    const response = await api.post('/api/presentations', {
      title: 'New Presentation',
      status: 'in_progress',
    });

    const presId = response.data.presentation_id;
    setPresentationId(presId);

    socketService.startPresentation(presId);
    await startRecording();
    setIsActive(true);
  };

  const endPresentation = () => {
    stopRecording();
    socketService.endPresentation();
    setIsActive(false);
  };

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
    if (slides[index]) {
      socketService.sendSlideImage(slides[index].data);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      {!isActive ? (
        <div>
          <h2>Presentation Setup</h2>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*,.pdf,.ppt,.pptx"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button onClick={() => fileInputRef.current?.click()}>Upload Slides</button>

          {slides.length > 0 && (
            <>
              <p>{slides.length} slides uploaded</p>
              <button onClick={startPresentation}>Start Presentation</button>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
          <div>
            {slides[currentSlide] && (
              <img
                src={slides[currentSlide].data}
                alt={`Slide ${currentSlide + 1}`}
                style={{ width: '100%', height: 'auto', borderRadius: 8, border: '1px solid #ddd' }}
              />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <button onClick={() => handleSlideChange(currentSlide - 1)} disabled={currentSlide === 0}>
                Previous
              </button>
              <span>
                {currentSlide + 1} / {slides.length}
              </span>
              <button onClick={() => handleSlideChange(currentSlide + 1)} disabled={currentSlide === slides.length - 1}>
                Next
              </button>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>Live Scores</h3>
              <div>
                <div>
                  <span>Content</span>
                  <div style={{ background: '#eee', height: 8, borderRadius: 4 }}>
                    <div style={{ background: '#4f46e5', height: 8, width: `${scores.content * 10}%`, borderRadius: 4 }} />
                  </div>
                  <span>{scores.content}/10</span>
                </div>
                <div>
                  <span>Delivery</span>
                  <div style={{ background: '#eee', height: 8, borderRadius: 4 }}>
                    <div style={{ background: '#4f46e5', height: 8, width: `${scores.delivery * 10}%`, borderRadius: 4 }} />
                  </div>
                  <span>{scores.delivery}/10</span>
                </div>
                <div>
                  <span>Engagement</span>
                  <div style={{ background: '#eee', height: 8, borderRadius: 4 }}>
                    <div style={{ background: '#4f46e5', height: 8, width: `${scores.engagement * 10}%`, borderRadius: 4 }} />
                  </div>
                  <span>{scores.engagement}/10</span>
                </div>
              </div>
            </div>

            <div>
              <h3>AI Questions</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                {aiQuestions.map((q, index) => (
                  <div key={index} style={{ border: '1px solid #ddd', padding: 8, borderRadius: 8 }}>
                    <p>{q.question}</p>
                    <span style={{ fontSize: 12, color: '#555' }}>
                      {new Date(q.timestamp * 1000).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: 8 }}>
            <div>
              {isRecording && <span style={{ display: 'inline-block', width: 8, height: 8, background: 'red', borderRadius: '50%', marginRight: 8 }} />}
              <span>Recording</span>
            </div>
            <button onClick={endPresentation}>End Presentation</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresentationView;
