const prisma = require('../config/database');

const createStudent = async (req, res) => {
  try {
    const { userId, roomId, status } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if user exists and is a student
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'student') {
      return res.status(400).json({ error: 'User must have student role' });
    }

    // Check if student already exists
    const existingStudent = await prisma.student.findUnique({
      where: { userId },
    });

    if (existingStudent) {
      return res.status(400).json({ error: 'Student already exists for this user' });
    }

    // If roomId is provided, check room availability
    if (roomId) {
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      if (room.occupied >= room.capacity) {
        return res.status(400).json({ error: 'Room is at full capacity' });
      }
    }

    const student = await prisma.student.create({
      data: {
        userId,
        roomId: roomId || null,
        status: status || 'active',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        room: true,
      },
    });

    // Update room occupied count if room is allocated
    if (roomId) {
      await prisma.room.update({
        where: { id: roomId },
        data: { occupied: { increment: 1 } },
      });
    }

    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        room: true,
      },
      orderBy: { admissionDate: 'desc' },
    });

    res.json({ students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        room: true,
        attendance: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId, status } = req.body;

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const updateData = {};

    if (status) {
      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({ error: 'Status must be active or inactive' });
      }
      updateData.status = status;
    }

    // Handle room allocation change
    if (roomId !== undefined) {
      if (roomId === null || roomId === '') {
        // Remove from current room
        if (student.roomId) {
          await prisma.room.update({
            where: { id: student.roomId },
            data: { occupied: { decrement: 1 } },
          });
        }
        updateData.roomId = null;
      } else if (roomId !== student.roomId) {
        // Check new room availability
        const newRoom = await prisma.room.findUnique({
          where: { id: roomId },
        });

        if (!newRoom) {
          return res.status(404).json({ error: 'Room not found' });
        }

        if (newRoom.occupied >= newRoom.capacity) {
          return res.status(400).json({ error: 'Room is at full capacity' });
        }

        // Decrement old room
        if (student.roomId) {
          await prisma.room.update({
            where: { id: student.roomId },
            data: { occupied: { decrement: 1 } },
          });
        }

        // Increment new room
        await prisma.room.update({
          where: { id: roomId },
          data: { occupied: { increment: 1 } },
        });

        updateData.roomId = roomId;
      }
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        room: true,
      },
    });

    res.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Student not found' });
    }
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Decrement room occupied count
    if (student.roomId) {
      await prisma.room.update({
        where: { id: student.roomId },
        data: { occupied: { decrement: 1 } },
      });
    }

    await prisma.student.delete({
      where: { id },
    });

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};

