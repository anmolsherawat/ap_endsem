const prisma = require('../config/database');

const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const userId = req.user.id;

    if (!title || !description || !category) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (!['electricity', 'water', 'cleaning'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId,
        title,
        description,
        category,
        status: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({ message: 'Complaint created successfully', complaint });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const { status, category } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    const where = {};

    // Students can only see their own complaints
    if (userRole === 'student') {
      where.userId = userId;
    }

    if (status) where.status = status;
    if (category) where.category = category;

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ complaints });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user.role;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    if (!['pending', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Status must be pending or resolved' });
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Only admins/wardens can update status, students can only update their own complaints
    if (userRole === 'student' && complaint.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only update your own complaints' });
    }

    // Only admins/wardens can change status to resolved
    if (status === 'resolved' && userRole === 'student') {
      return res.status(403).json({ error: 'Only admins can resolve complaints' });
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ message: 'Complaint updated successfully', complaint: updatedComplaint });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    console.error('Update complaint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  updateComplaint,
};

