import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { TableSkeleton } from '../components/LoadingSkeleton';

const Rooms = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'AC',
    capacity: '',
    floor: '',
  });
  const [filters, setFilters] = useState({ floor: '', type: '' });

  useEffect(() => {
    fetchRooms();
  }, [filters]);

  const fetchRooms = async () => {
    try {
      const params = {};
      if (filters.floor) params.floor = filters.floor;
      if (filters.type) params.type = filters.type;

      const response = await api.get('/rooms', { params });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/rooms/${editingRoom.id}`, formData);
        toast.success('Room updated successfully');
      } else {
        await api.post('/rooms', formData);
        toast.success('Room created successfully');
      }
      setIsModalOpen(false);
      setEditingRoom(null);
      setFormData({ roomNumber: '', type: 'AC', capacity: '', floor: '' });
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      type: room.type,
      capacity: room.capacity.toString(),
      floor: room.floor.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await api.delete(`/rooms/${id}`);
      toast.success('Room deleted successfully');
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'warden';

  return (
    <div style={{ padding: '24px', backgroundColor: darkMode ? '#111827' : '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: darkMode ? '#fff' : '#111' }}>Rooms Management</h1>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingRoom(null);
              setFormData({ roomNumber: '', type: 'AC', capacity: '', floor: '' });
              setIsModalOpen(true);
            }}
            style={{ backgroundColor: '#FF6B35', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
          >
            Add Room
          </button>
        )}
      </div>

      <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Floor</label>
            <select
              value={filters.floor}
              onChange={(e) => setFilters({ ...filters, floor: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
            >
              <option value="">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
            >
              <option value="">All Types</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setFilters({ floor: '', type: '' })}
              style={{ width: '100%', backgroundColor: darkMode ? '#374151' : '#e5e7eb', color: darkMode ? '#d1d5db' : '#374151', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <div style={{ backgroundColor: darkMode ? '#1f2937' : 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: darkMode ? '#374151' : '#f9fafb' }}>
              <tr>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Room Number</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Type</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Floor</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Capacity</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Occupied</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Available</th>
                {isAdmin && <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: darkMode ? '#d1d5db' : '#6b7280', textTransform: 'uppercase' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} style={{ borderTop: '1px solid ' + (darkMode ? '#374151' : '#e5e7eb') }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#fff' : '#111' }}>{room.roomNumber}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>{room.type}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>{room.floor}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>{room.capacity}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>{room.occupied}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                    {room.capacity - room.occupied}
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500' }}>
                      <button
                        onClick={() => handleEdit(room)}
                        style={{ color: '#FF6B35', background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
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
          setEditingRoom(null);
        }}
        title={editingRoom ? 'Edit Room' : 'Add Room'}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Room Number</label>
            <input
              type="text"
              required
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Type</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
            >
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Capacity</label>
            <input
              type="number"
              required
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid ' + (darkMode ? '#374151' : '#d1d5db'), borderRadius: '4px', fontSize: '14px', backgroundColor: darkMode ? '#374151' : 'white', color: darkMode ? '#fff' : '#111' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: darkMode ? '#d1d5db' : '#374151' }}>Floor</label>
            <input
              type="number"
              required
              min="1"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
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
              {editingRoom ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Rooms;

