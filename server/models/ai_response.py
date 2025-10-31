from ..extensions import db


class AIResponse(db.Model):
    __tablename__ = 'ai_responses'

    id = db.Column(db.Integer, primary_key=True)
    presentation_id = db.Column(db.Integer, db.ForeignKey('presentations.id'), nullable=False)
    question_text = db.Column(db.Text)
    response_type = db.Column(db.String(50))  # 'question' or 'score_update'
    json_data = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'presentation_id': self.presentation_id,
            'question_text': self.question_text,
            'response_type': self.response_type,
            'json_data': self.json_data,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        }
