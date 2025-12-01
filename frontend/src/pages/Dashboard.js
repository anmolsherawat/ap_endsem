import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/axios';
import { PageSkeleton } from '../components/LoadingSkeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'admin' || user?.role === 'warden') {
        const [studentsRes, roomsRes, complaintsRes] = await Promise.all([
          api.get('/students'),
          api.get('/rooms'),
          api.get('/complaints'),
        ]);

        const students = studentsRes.data.students;
        const rooms = roomsRes.data.rooms;
        const complaints = complaintsRes.data.complaints;

        const totalStudents = students.length;
        const activeStudents = students.filter((s) => s.status === 'active').length;
        const totalRooms = rooms.length;
        const availableRooms = rooms.filter((r) => r.occupied < r.capacity).length;
        const pendingComplaints = complaints.filter((c) => c.status === 'pending').length;
        const resolvedComplaints = complaints.filter((c) => c.status === 'resolved').length;

        setStats({
          totalStudents,
          activeStudents,
          totalRooms,
          availableRooms,
          pendingComplaints,
          resolvedComplaints,
        });
      } else {
        const [complaintsRes, studentRes] = await Promise.all([
          api.get('/complaints'),
          api.get('/students'),
        ]);

        const myComplaints = complaintsRes.data.complaints;
        const myStudent = studentRes.data.students.find((s) => s.userId === user.id);

        let attendanceStats = { total: 0, present: 0, absent: 0, percentage: 0 };
        if (myStudent) {
          try {
            const attRes = await api.get(`/attendance/student/${myStudent.id}`);
            attendanceStats = attRes.data.statistics;
          } catch (error) {
            console.error('Error fetching attendance:', error);
          }
        }

        setStats({
          myComplaints: myComplaints.length,
          pendingComplaints: myComplaints.filter((c) => c.status === 'pending').length,
          room: myStudent?.room,
          attendanceStats,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <PageSkeleton />
      </div>
    );
  }

  if (user?.role === 'admin' || user?.role === 'warden') {
    return (
      <div style={{ padding: '24px', backgroundColor: darkMode ? '#111827' : '#f9fafb', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '24px', color: darkMode ? '#fff' : '#111' }}>Admin Dashboard</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B35' }}>{stats?.totalStudents || 0}</div>
            <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>Total Students</div>
          </div>
          <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{stats?.availableRooms || 0}</div>
            <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>Available Rooms</div>
          </div>
          <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>{stats?.pendingComplaints || 0}</div>
            <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>Pending Complaints</div>
          </div>
          <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#9333ea' }}>{stats?.activeStudents || 0}</div>
            <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>Active Students</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: darkMode ? '#111827' : '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', marginBottom: '24px', color: darkMode ? '#fff' : '#111' }}>Student Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF6B35' }}>
            {stats?.room ? stats.room.roomNumber : 'N/A'}
          </div>
          <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>Room Number</div>
          {stats?.room && (
            <div style={{ fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>
              {stats.room.type} | Floor {stats.room.floor}
            </div>
          )}
        </div>

        <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>{stats?.myComplaints || 0}</div>
          <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>My Complaints</div>
          <div style={{ fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>
            {stats?.pendingComplaints || 0} pending
          </div>
        </div>

        <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
            {stats?.attendanceStats?.percentage?.toFixed(1) || 0}%
          </div>
          <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>Attendance</div>
          <div style={{ fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280', marginTop: '8px' }}>
            {stats?.attendanceStats?.present || 0} present / {stats?.attendanceStats?.total || 0} total
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: darkMode ? '#fff' : '#111' }}>Personal Information</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: darkMode ? '#d1d5db' : '#374151' }}>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          {user?.phone && <p><strong>Phone:</strong> {user.phone}</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
