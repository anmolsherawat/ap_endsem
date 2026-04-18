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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div>
        <div className="mb-16">
          <h1 className="text-4xl font-semibold mb-3">
            <span className="gradient-text">Admin Dashboard</span>
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Welcome back, {user?.name}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="card-premium p-10 glow-border">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl mb-6">
              👥
            </div>
            <div className={`text-5xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {stats?.totalStudents || 0}
            </div>
            <div className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Total Students
            </div>
          </div>
          <div className="card-premium p-10 glow-border">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl mb-6">
              🏠
            </div>
            <div className={`text-5xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {stats?.availableRooms || 0}
            </div>
            <div className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Available Rooms
            </div>
          </div>
          <div className="card-premium p-10 glow-border">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-3xl mb-6">
              ⚠️
            </div>
            <div className={`text-5xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {stats?.pendingComplaints || 0}
            </div>
            <div className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Pending Complaints
            </div>
          </div>
          <div className="card-premium p-10 glow-border">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-3xl mb-6">
              ✅
            </div>
            <div className={`text-5xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {stats?.activeStudents || 0}
            </div>
            <div className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Active Students
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-16">
        <h1 className="text-4xl font-semibold mb-3">
          <span className="gradient-text">Student Dashboard</span>
        </h1>
        <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Welcome back, {user?.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
        <div className="card-premium p-10 glow-border">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl mb-6">
            🏠
          </div>
          <div className={`text-5xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {stats?.room ? stats.room.roomNumber : 'N/A'}
          </div>
          <div className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Room Number
          </div>
          {stats?.room && (
            <div className={`text-sm mt-3 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              {stats.room.type} • Floor {stats.room.floor}
            </div>
          )}
        </div>

        <div className="card-premium p-10 glow-border">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-3xl mb-6">
            📝
          </div>
          <div className={`text-5xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {stats?.myComplaints || 0}
          </div>
          <div className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            My Complaints
          </div>
          <div className={`text-sm mt-3 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            {stats?.pendingComplaints || 0} pending
          </div>
        </div>

        <div className="card-premium p-10 glow-border">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl mb-6">
            ✅
          </div>
          <div className={`text-5xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {stats?.attendanceStats?.percentage?.toFixed(1) || 0}%
          </div>
          <div className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Attendance
          </div>
          <div className={`text-sm mt-3 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            {stats?.attendanceStats?.present || 0} / {stats?.attendanceStats?.total || 0} days
          </div>
        </div>
      </div>

      <div className="card-premium p-12">
        <h2 className={`text-2xl font-semibold mb-10 pb-5 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <span className={`block text-sm mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              Name
            </span>
            <span className={`text-xl font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              {user?.name}
            </span>
          </div>
          <div>
            <span className={`block text-sm mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              Email
            </span>
            <span className={`text-xl font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              {user?.email}
            </span>
          </div>
          {user?.phone && (
            <div>
              <span className={`block text-sm mb-2 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Phone
              </span>
              <span className={`text-xl font-medium ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                {user.phone}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
