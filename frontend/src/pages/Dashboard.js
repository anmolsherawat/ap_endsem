import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import api from '../utils/axios';
import { PageSkeleton } from '../components/LoadingSkeleton';

const Dashboard = () => {
  const { user } = useAuth();
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
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700">
            <div className="text-3xl font-bold text-hostel-orange">{stats?.totalStudents || 0}</div>
            <div className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Total Students</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700">
            <div className="text-3xl font-bold text-green-600">{stats?.availableRooms || 0}</div>
            <div className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Available Rooms</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700">
            <div className="text-3xl font-bold text-yellow-600">{stats?.pendingComplaints || 0}</div>
            <div className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Pending Complaints</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700">
            <div className="text-3xl font-bold text-purple-600">{stats?.activeStudents || 0}</div>
            <div className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Active Students</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-hostel-orange">
            {stats?.room ? stats.room.roomNumber : 'N/A'}
          </div>
          <div className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Room Number</div>
          {stats?.room && (
            <div className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              {stats.room.type} | Floor {stats.room.floor}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-yellow-600">{stats?.myComplaints || 0}</div>
          <div className="text-gray-500 dark:text-gray-400 mt-2 font-medium">My Complaints</div>
          <div className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {stats?.pendingComplaints || 0} pending
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700">
          <div className="text-3xl font-bold text-green-600">
            {stats?.attendanceStats?.percentage?.toFixed(1) || 0}%
          </div>
          <div className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Attendance</div>
          <div className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            {stats?.attendanceStats?.present || 0} present / {stats?.attendanceStats?.total || 0} total
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-4">Personal Information</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-semibold w-32">Name:</span>
            <span>{user?.name}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-semibold w-32">Email:</span>
            <span>{user?.email}</span>
          </div>
          {user?.phone && (
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-semibold w-32">Phone:</span>
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
