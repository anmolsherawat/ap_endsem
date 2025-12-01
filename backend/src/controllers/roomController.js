const prisma = require('../config/database');

const createRoom = async (req, res) => {
  try {
    const { roomNumber, type, capacity, floor } = req.body;

    if (!roomNumber || !type || !capacity || !floor) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!['AC', 'Non-AC'].includes(type)) {
      return res.status(400).json({ error: 'Room type must be AC or Non-AC' });
    }

    const room = await prisma.room.create({
      data: {
        roomNumber,
        type,
        capacity: parseInt(capacity),
        floor: parseInt(floor),
        occupied: 0,
      },
    });

    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Room number already exists' });
    }
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const { floor, type } = req.query;

    const where = {};
    if (floor) where.floor = parseInt(floor);
    if (type) where.type = type;

    const rooms = await prisma.room.findMany({
      where,
      include: {
        students: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { roomNumber: 'asc' },
    });

    res.json({ rooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomNumber, type, capacity, floor, occupied } = req.body;

    const updateData = {};

    if (roomNumber) updateData.roomNumber = roomNumber;
    if (type) {
      if (!['AC', 'Non-AC'].includes(type)) {
        return res.status(400).json({ error: 'Room type must be AC or Non-AC' });
      }
      updateData.type = type;
    }
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (floor !== undefined) updateData.floor = parseInt(floor);
    if (occupied !== undefined) updateData.occupied = parseInt(occupied);

    const room = await prisma.room.update({
      where: { id },
      data: updateData,
    });

    res.json({ message: 'Room updated successfully', room });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Room not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Room number already exists' });
    }
    console.error('Update room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if room has students
    const room = await prisma.room.findUnique({
      where: { id },
      include: { students: true },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    if (room.students.length > 0) {
      return res.status(400).json({ error: 'Cannot delete room with allocated students' });
    }

    await prisma.room.delete({
      where: { id },
    });

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};

