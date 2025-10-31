from ..extensions import db


class Transcript(db.Model):
    __tablename__ = 'transcripts'

    id = db.Column(db.Integer, primary_key=True)
    presentation_id = db.Column(db.Integer, db.ForeignKey('presentations.id'), nullable=False)
    transcript_text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'presentation_id': self.presentation_id,
            'transcript_text': self.transcript_text,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        }
