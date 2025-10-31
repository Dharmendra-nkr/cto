import React, { useState, useEffect } from 'react';
import api from '../../services/apiClient';

const StudentDashboard = () => {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPresentations();
  }, []);

  const fetchPresentations = async () => {
    try {
      const response = await api.get('/api/presentations');
      setPresentations(response.data.presentations || []);
    } catch (error) {
      console.error('Error fetching presentations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>My Presentations</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {presentations.map((pres) => (
            <div key={pres.id} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
              <h3>{pres.title}</h3>
              <div>
                <div>Content: {pres?.marks?.content_score ?? 'N/A'}/10</div>
                <div>Delivery: {pres?.marks?.delivery_score ?? 'N/A'}/10</div>
                <div>Engagement: {pres?.marks?.engagement_score ?? 'N/A'}/10</div>
                <div>Total: {pres?.marks?.total_score ?? 'N/A'}/30</div>
              </div>
              <div style={{ fontSize: 12, color: '#555' }}>
                {pres.start_time ? new Date(pres.start_time).toLocaleDateString() : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
