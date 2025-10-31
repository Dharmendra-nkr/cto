import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(url = import.meta.env.VITE_WS_URL || 'http://localhost:5001') {
    this.socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
    });

    return this.socket;
  }

  startPresentation(presentationId) {
    this.socket.emit('start_presentation', { presentation_id: presentationId });
  }

  sendAudioChunk(audioBlob) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Audio = reader.result.split(',')[1];
      this.socket.emit('audio_chunk', { audio: base64Audio });
    };
    reader.readAsDataURL(audioBlob);
  }

  sendSlideImage(imageData) {
    this.socket.emit('slide_image', { image: imageData });
  }

  endPresentation() {
    this.socket.emit('end_presentation');
  }

  onAIQuestion(callback) {
    this.socket.on('ai_question', callback);
  }

  onScoreUpdate(callback) {
    this.socket.on('live_score_update', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();
