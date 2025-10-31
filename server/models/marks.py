from ..extensions import db


class Marks(db.Model):
    __tablename__ = 'marks'

    id = db.Column(db.Integer, primary_key=True)
    presentation_id = db.Column(db.Integer, db.ForeignKey('presentations.id'), nullable=False)
    content_score = db.Column(db.Float)
    delivery_score = db.Column(db.Float)
    engagement_score = db.Column(db.Float)
    total_score = db.Column(db.Float)
    staff_comments = db.Column(db.Text)
    is_finalized = db.Column(db.Boolean, default=False)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'presentation_id': self.presentation_id,
            'content_score': self.content_score,
            'delivery_score': self.delivery_score,
            'engagement_score': self.engagement_score,
            'total_score': self.total_score,
            'staff_comments': self.staff_comments,
            'is_finalized': self.is_finalized,
        }
