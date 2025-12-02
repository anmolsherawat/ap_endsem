const prisma = require('../config/database');

const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ error: 'Status must be present or absent' });
    }

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Parse date and set to start of day for consistency
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this date
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        studentId_date: {
          studentId,
          date: attendanceDate,
        },
      },
    });

    let attendance;

    if (existingAttendance) {
      // Update existing attendance
      attendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: { status },
      });
    } else {
      // Create new attendance
      attendance = await prisma.attendance.create({
        data: {
          studentId,
          date: attendanceDate,
          status,
        },
      });
    }

    res.status(201).json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Attendance already marked for this date' });
    }
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    const userId = req.user.id;

    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Students can only view their own attendance
    if (userRole === 'student' && student.userId !== userId) {
      return res.status(403).json({ error: 'You can only view your own attendance' });
    }

    const { startDate, endDate } = req.query;

    const where = { studentId: id };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const attendance = await prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    // Calculate statistics
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === 'present').length;
    const absent = attendance.filter((a) => a.status === 'absent').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      attendance,
      statistics: {
        total,
        present,
        absent,
        percentage: parseFloat(percentage),
      },
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  markAttendance,
  getStudentAttendance,
};

