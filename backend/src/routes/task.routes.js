const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Admin and manager 
router.post('/', protect, authorize('admin', 'manager'), taskController.createTask);

// All users
router.get('/', protect, taskController.getTasks);

// All users
router.get('/:id', protect, taskController.getTaskById);

// Creator or assignee
router.put('/:id', protect, taskController.updateTask);

// Admin 
router.delete('/:id', protect, authorize('admin'), taskController.deleteTask);

module.exports = router; 