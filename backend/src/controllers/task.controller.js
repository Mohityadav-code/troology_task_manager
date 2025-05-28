const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Admin, Manager
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    // Create task
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      creator: req.user._id
    });

    // Populate creator and assignedTo
    await task.populate('creator assignedTo');

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all tasks with filters
// @route   GET /api/tasks
// @access  Authenticated users
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo } = req.query;
    const filter = {};

    // Build filter based on query parameters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    // For non-admin and non-manager, only show assigned tasks
    if (req.user.role === 'employee') {
      filter.assignedTo = req.user._id;
    }

    // Get tasks
    const tasks = await Task.find(filter)
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Authenticated users
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is authorized to view this task
    if (
      req.user.role === 'employee' &&
      task.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Creator or Assignee
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    // Find task
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is authorized to update this task
    const isCreator = task.creator.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo.toString() === req.user._id.toString();

    if (
      req.user.role === 'employee' &&
      !isAssignee
    ) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // For non-admin and non-manager, only allow updating status
    if (req.user.role === 'employee' && isAssignee) {
      task.status = status || task.status;
    } else {
      // Admin or manager or creator can update everything
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      task.assignedTo = assignedTo || task.assignedTo;
    }

    // Save updated task
    const updatedTask = await task.save();

    // Populate creator and assignedTo
    await updatedTask.populate('creator assignedTo');

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Admin only
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();

    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 