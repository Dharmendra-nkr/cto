from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..extensions import db
from ..models.user import User
from ..models.presentation import Presentation
from ..models.marks import Marks
from ..models.transcript import Transcript

api_bp = Blueprint('api', __name__, url_prefix='/api')


@api_bp.route('/presentations', methods=['GET'])
@login_required
def get_presentations():
    if current_user.role == 'student':
        presentations = Presentation.query.filter_by(
            student_id=current_user.id
        ).all()
    else:
        presentations = Presentation.query.all()

    return jsonify({
        'presentations': [p.to_dict() for p in presentations]
    }), 200


@api_bp.route('/presentations', methods=['POST'])
@login_required
def create_presentation():
    data = request.json or {}
    title = data.get('title', 'Untitled Presentation')

    presentation = Presentation(
        student_id=current_user.id,
        title=title,
        status='in_progress'
    )
    db.session.add(presentation)
    db.session.commit()

    marks = Marks(presentation_id=presentation.id)
    db.session.add(marks)
    db.session.commit()

    return jsonify({
        'presentation_id': presentation.id,
        'message': 'Presentation created'
    }), 201


@api_bp.route('/marks/<int:marks_id>', methods=['PUT'])
@login_required
def update_marks(marks_id):
    if current_user.role != 'staff':
        return jsonify({'error': 'Unauthorized'}), 403

    marks = Marks.query.get_or_404(marks_id)
    data = request.json or {}

    marks.content_score = data.get('content_score', marks.content_score)
    marks.delivery_score = data.get('delivery_score', marks.delivery_score)
    marks.engagement_score = data.get('engagement_score', marks.engagement_score)
    marks.staff_comments = data.get('staff_comments', marks.staff_comments)
    if all(v is not None for v in [marks.content_score, marks.delivery_score, marks.engagement_score]):
        marks.total_score = (
            float(marks.content_score) +
            float(marks.delivery_score) +
            float(marks.engagement_score)
        )
    marks.is_finalized = True

    db.session.commit()
    return jsonify({'message': 'Marks updated successfully'}), 200


@api_bp.route('/students/presentations', methods=['GET'])
@login_required
def get_students_with_presentations():
    if current_user.role != 'staff':
        return jsonify({'error': 'Unauthorized'}), 403

    students = User.query.filter_by(role='student').all()
    result = []

    for student in students:
        presentations = []
        for pres in student.presentations:
            presentations.append({
                'id': pres.id,
                'title': pres.title,
                'start_time': pres.start_time,
                'marks': pres.marks.first().to_dict() if pres.marks.first() else None
            })

        result.append({
            'id': student.id,
            'username': student.username,
            'presentations': presentations
        })

    return jsonify(result), 200


@api_bp.route('/transcripts/<int:presentation_id>', methods=['GET'])
@login_required
def get_transcript(presentation_id):
    transcript = Transcript.query.filter_by(
        presentation_id=presentation_id
    ).first()

    if not transcript:
        return jsonify({'error': 'Transcript not found'}), 404

    return jsonify({
        'transcript': transcript.transcript_text
    }), 200
