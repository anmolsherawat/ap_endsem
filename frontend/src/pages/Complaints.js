import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { TableSkeleton } from '../components/LoadingSkeleton';

const Complaints = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electricity',
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints');
      setComplaints(response.data.complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', formData);
      toast.success('Complaint submitted successfully');
      setIsModalOpen(false);
      setFormData({ title: '', description: '', category: 'electricity' });
      fetchComplaints();
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/complaints/${id}`, { status });
      toast.success('Complaint status updated');
      fetchComplaints();
    } catch (error) {
      console.error('Error updating complaint:', error);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'warden';

  return (
    <div style={{ padding: '24px', backgroundColor: darkMode ? '#111827' : '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: darkMode ? '#fff' : '#111' }}>
          {isAdmin ? 'Complaints Management' : 'My Complaints'}
        </h1>
        {!isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: '#FF6B35', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
          >
            Submit Complaint
          </button>
        )}
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: darkMode ? '#374151' : '#f9fafb' }}>
              <tr>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Title</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Category</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Status</th>
                {isAdmin && (
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Submitted By</th>
                )}
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Date</th>
                {isAdmin && (
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id} style={{ borderTop: '1px solid ' + (darkMode ? '#374151' : '#e5e7eb') }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: darkMode ? '#fff' : '#111' }}>{complaint.title}</div>
                    <div style={{ fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '4px' }}>{complaint.description}</div>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280', textTransform: 'capitalize' }}>
                    {complaint.category}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '9999px', backgroundColor: complaint.status === 'resolved' ? (darkMode ? '#065f46' : '#d1fae5') : (darkMode ? '#854d0e' : '#fef3c7'), color: complaint.status === 'resolved' ? (darkMode ? '#6ee7b7' : '#065f46') : (darkMode ? '#fcd34d' : '#854d0e') }}>
                      {complaint.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                      {complaint.user.name}
                    </td>
                  )}
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>
                      {complaint.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                          style={{ color: '#FF6B35', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({ title: '', description: '', category: 'electricity' });
        }}
        title="Submit Complaint"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Category</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
            >
              <option value="electricity">Electricity</option>
              <option value="water">Water</option>
              <option value="cleaning">Cleaning</option>
              <option value="food">Food</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Description</label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '8px 16px', backgroundColor: darkMode ? '#374151' : '#e5e7eb', color: darkMode ? '#d1d5db' : '#374151', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ padding: '8px 16px', backgroundColor: '#FF6B35', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Complaints;

