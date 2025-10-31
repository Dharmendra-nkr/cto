from ..extensions import db


class Presentation(db.Model):
    __tablename__ = 'presentations'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(20), default='scheduled')
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)

    marks = db.relationship('Marks', backref='presentation', lazy='dynamic', cascade='all, delete-orphan')
    transcripts = db.relationship('Transcript', backref='presentation', lazy='dynamic', cascade='all, delete-orphan')
    ai_responses = db.relationship('AIResponse', backref='presentation', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self) -> dict:
        first_marks = self.marks.first()
        return {
            'id': self.id,
            'student_id': self.student_id,
            'title': self.title,
            'status': self.status,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'marks': first_marks.to_dict() if first_marks else None,
        }
