const express = require('express');
const router = express.Router();
const { markAttendance, getStudentAttendance } = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middlewares/auth');

router.post('/mark', authenticate, authorize('admin', 'warden'), markAttendance);
router.get('/student/:id', authenticate, getStudentAttendance);

module.exports = router;

