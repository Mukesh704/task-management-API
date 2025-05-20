const taskModel = require('../models/task');

async function createTaskController(req, res) {
    try {
        const tokenData = req.user;
        const userId = tokenData.id;

        const taskData = req.body;

        const newTask = await taskModel.create({
            user: userId,
            ...taskData
        })

        res.status(200).json({
            success: true,
            response: newTask
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
};

async function getAllUsersTaskController(req, res) {
    try {
    const userId = req.user.id;

    // Query parameters
    const { status, priority, dueBefore, sortBy, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = { user: userId };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (dueBefore) {
      filter.dueDate = { $lte: new Date(dueBefore) };
    }

    // Sorting
    let sort = {};
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sort[field] = order === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Default: newest first
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch tasks
    const tasks = await taskModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v'); // Optional: Exclude unwanted fields

    const total = await taskModel.countDocuments(filter);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      tasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

function getSingleTaskController(req, res) {};

function updateTaskController(req, res) {};

function deleteTaskController(req, res) {};

module.exports = {
    createTaskController,
    getAllUsersTaskController,
    getSingleTaskController,
    updateTaskController,
    deleteTaskController
}