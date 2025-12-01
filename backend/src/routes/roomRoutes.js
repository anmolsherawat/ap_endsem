const express = require('express');
const router = express.Router();
const { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom } = require('../controllers/roomController');
const { authenticate, authorize } = require('../middlewares/auth');

router.post('/', authenticate, authorize('admin', 'warden'), createRoom);
router.get('/', authenticate, getAllRooms);
router.get('/:id', authenticate, getRoomById);
router.put('/:id', authenticate, authorize('admin', 'warden'), updateRoom);
router.delete('/:id', authenticate, authorize('admin', 'warden'), deleteRoom);

module.exports = router;

