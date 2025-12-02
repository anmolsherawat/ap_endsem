const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('admin', 'warden'), getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, authorize('admin', 'warden'), updateUser);
router.delete('/:id', authenticate, authorize('admin', 'warden'), deleteUser);

module.exports = router;

