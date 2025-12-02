const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } = require('../controllers/studentController');
const { authenticate, authorize } = require('../middlewares/auth');

router.post('/', authenticate, authorize('admin', 'warden'), createStudent);
router.get('/', authenticate, getAllStudents);
router.get('/:id', authenticate, getStudentById);
router.put('/:id', authenticate, authorize('admin', 'warden'), updateStudent);
router.delete('/:id', authenticate, authorize('admin', 'warden'), deleteStudent);

module.exports = router;

