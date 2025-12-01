const express = require('express');
const router = express.Router();
const { createComplaint, getAllComplaints, updateComplaint } = require('../controllers/complaintController');
const { authenticate } = require('../middlewares/auth');

router.post('/', authenticate, createComplaint);
router.get('/', authenticate, getAllComplaints);
router.put('/:id', authenticate, updateComplaint);

module.exports = router;

