import React, { useState, useEffect } from 'react';
import api from '../../services/apiClient';

const StaffDashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedMarks, setEditedMarks] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/students/presentations');
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleEdit = (presentation) => {
    setSelectedPresentation(presentation);
    setEditedMarks({
      content_score: presentation?.marks?.content_score ?? 0,
      delivery_score: presentation?.marks?.delivery_score ?? 0,
      engagement_score: presentation?.marks?.engagement_score ?? 0,
      staff_comments: presentation?.marks?.staff_comments || '',
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      await api.put(`/api/marks/${selectedPresentation.marks.id}`, editedMarks);
      setEditMode(false);
      fetchStudents();
    } catch (error) {
      console.error('Error saving marks:', error);
    }
  };

  return (
    <div>
      <h1>Student Presentations</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Presentation Title</th>
            <th>Date</th>
            <th>Content</th>
            <th>Delivery</th>
            <th>Engagement</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) =>
            (student.presentations || []).map((pres) => (
              <tr key={pres.id}>
                <td>{student.username}</td>
                <td>{pres.title}</td>
                <td>{pres.start_time ? new Date(pres.start_time).toLocaleDateString() : ''}</td>
                <td>{pres?.marks?.content_score ?? '-'}</td>
                <td>{pres?.marks?.delivery_score ?? '-'}</td>
                <td>{pres?.marks?.engagement_score ?? '-'}</td>
                <td>{pres?.marks?.total_score ?? '-'}</td>
                <td>
                  {pres.marks && (
                    <button onClick={() => handleEdit(pres)}>Edit</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {editMode && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ maxWidth: 480, margin: '10% auto', background: '#fff', padding: 16, borderRadius: 8 }}>
            <h2>Edit Marks</h2>
            <div>
              <label>Content Score (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={editedMarks.content_score}
                onChange={(e) => setEditedMarks({ ...editedMarks, content_score: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label>Delivery Score (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={editedMarks.delivery_score}
                onChange={(e) => setEditedMarks({ ...editedMarks, delivery_score: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label>Engagement Score (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={editedMarks.engagement_score}
                onChange={(e) => setEditedMarks({ ...editedMarks, engagement_score: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label>Comments</label>
              <textarea
                rows="4"
                value={editedMarks.staff_comments}
                onChange={(e) => setEditedMarks({ ...editedMarks, staff_comments: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
