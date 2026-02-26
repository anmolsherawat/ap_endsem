import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { TableSkeleton } from '../components/LoadingSkeleton';

const Students = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    roomId: '',
    status: 'active',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, usersRes, roomsRes] = await Promise.all([
        api.get('/students'),
        api.get('/users'),
        api.get('/rooms'),
      ]);

      setStudents(studentsRes.data.students);
      setUsers(usersRes.data.users.filter((u) => u.role === 'student'));
      setRooms(roomsRes.data.rooms);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent.id}`, formData);
        toast.success('Student updated successfully');
      } else {
        await api.post('/students', formData);
        toast.success('Student registered successfully');
      }
      setIsModalOpen(false);
      setEditingStudent(null);
      setFormData({ userId: '', roomId: '', status: 'active' });
      fetchData();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      userId: student.userId,
      roomId: student.roomId || '',
      status: student.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      await api.delete(`/students/${id}`);
      toast.success('Student deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'warden';

  if (!isAdmin) {
    return <div style={{ padding: '24px', color: darkMode ? '#fff' : '#111' }}>Access denied. Admin only.</div>;
  }

  return (
    <div style={{ padding: '24px', backgroundColor: darkMode ? '#111827' : '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: darkMode ? '#fff' : '#111' }}>Students Management</h1>
        <button
          onClick={() => {
            setEditingStudent(null);
            setFormData({ userId: '', roomId: '', status: 'active' });
            setIsModalOpen(true);
          }}
          style={{ backgroundColor: '#FF6B35', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
        >
          Register Student
        </button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: darkMode ? '#374151' : '#f9fafb' }}>
              <tr>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Name</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Phone</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Room</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} style={{ borderTop: '1px solid ' + (darkMode ? '#374151' : '#e5e7eb') }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#fff' : '#111' }}>
                    {student.user.name}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>{student.user.email}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>{student.user.phone || 'N/A'}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                    {student.room ? student.room.roomNumber : 'Not Allocated'}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '9999px', backgroundColor: student.status === 'active' ? (darkMode ? '#065f46' : '#d1fae5') : (darkMode ? '#7f1d1d' : '#fee2e2'), color: student.status === 'active' ? (darkMode ? '#6ee7b7' : '#065f46') : (darkMode ? '#fca5a5' : '#7f1d1d') }}>
                      {student.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>
                    <button
                      onClick={() => handleEdit(student)}
                      style={{ color: '#FF6B35', background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      style={{ color: darkMode ? '#f87171' : '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
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
          setEditingStudent(null);
        }}
        title={editingStudent ? 'Edit Student' : 'Register Student'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>User</label>
            <select
              required
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
              disabled={!!editingStudent}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Room (Optional)</label>
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
            >
              <option value="">No Room</option>
              {rooms
                .filter((r) => r.occupied < r.capacity)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roomNumber} ({r.type}, Floor {r.floor}) - {r.capacity - r.occupied} available
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Status</label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              {editingStudent ? 'Update' : 'Register'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;

