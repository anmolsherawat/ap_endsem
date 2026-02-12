import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { TableSkeleton } from '../components/LoadingSkeleton';

const Attendance = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'present',
  });

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'warden') {
      fetchStudents();
    } else {
      fetchStudentAttendance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentAttendance = async () => {
    try {
      const studentsRes = await api.get('/students');
      const myStudent = studentsRes.data.students.find((s) => s.userId === user.id);

      if (myStudent) {
        const attRes = await api.get(`/attendance/student/${myStudent.id}`);
        setAttendance(attRes.data.attendance);
        setStats(attRes.data.statistics);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (studentId) => {
    setSelectedStudent(studentId);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attendance/mark', {
        studentId: selectedStudent,
        ...formData,
      });
      toast.success('Attendance marked successfully');
      setIsModalOpen(false);
      setFormData({ date: new Date().toISOString().split('T')[0], status: 'present' });
      fetchStudents();
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'warden';

  if (loading) {
    return (
      <div style={{ padding: '24px', backgroundColor: darkMode ? '#111827' : '#f9fafb', minHeight: '100vh' }}>
        <TableSkeleton />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div style={{ padding: '24px', backgroundColor: darkMode ? '#111827' : '#f9fafb', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '24px', color: darkMode ? '#fff' : '#111' }}>Attendance Management</h1>

        <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: darkMode ? '#374151' : '#f9fafb' }}>
              <tr>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Student</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Email</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Room</th>
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
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                    {student.room ? student.room.roomNumber : 'N/A'}
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>
                    <button
                      onClick={() => handleMarkAttendance(student.id)}
                      style={{ color: '#FF6B35', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Mark Attendance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Mark Attendance"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Status</label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
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
                Mark
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: darkMode ? '#111827' : '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '24px', color: darkMode ? '#fff' : '#111' }}>My Attendance</h1>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B35' }}>{stats.total}</div>
            <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>Total Days</div>
          </div>
          <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: darkMode ? '#4ade80' : '#16a34a' }}>{stats.present}</div>
            <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>Present</div>
          </div>
          <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: darkMode ? '#f87171' : '#dc2626' }}>{stats.absent}</div>
            <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>Absent</div>
          </div>
          <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: darkMode ? '#a78bfa' : '#9333ea' }}>{stats.percentage.toFixed(1)}%</div>
            <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>Attendance %</div>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: darkMode ? '#374151' : '#f9fafb' }}>
            <tr>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id} style={{ borderTop: '1px solid ' + (darkMode ? '#374151' : '#e5e7eb') }}>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#fff' : '#111' }}>
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '9999px', backgroundColor: record.status === 'present' ? (darkMode ? '#065f46' : '#d1fae5') : (darkMode ? '#7f1d1d' : '#fee2e2'), color: record.status === 'present' ? (darkMode ? '#6ee7b7' : '#065f46') : (darkMode ? '#fca5a5' : '#991b1b') }}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;

