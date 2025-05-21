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

async function getSingleTaskController(req, res) {
  try {
    const userId = req.user.id;

    const taskId = req.params.id;
    const task = await taskModel.findById(taskId);

    if(!task) {
      return res.status(200).json({
        success: false,
        error: `Task doesn't exist`
      })
    }

    // Checking if the task belongs to the user
    if(task.user.toString() !== userId) {
      return res.status(404).json({
        success: false,
        error: 'Unauthorized'
      })
    }

    // Hiding userId field from response
    const taskObj = task.toObject();
    delete taskObj.user;

    res.status(200).json({
      success: true,
      response: taskObj
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
};

async function updateTaskController(req, res) {
  try {
    const userId = req.user.id;

    const taskId = req.params.id;
    const task = await taskModel.findById(taskId);

    const data = req.body;

    if(!task) {
      return res.status(404).jason({
        success: false,
        error: 'Task not found'
      })
    }

    if(task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      })
    }

    const response = await taskModel.findByIdAndUpdate(taskId, data, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      response
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
};

async function deleteTaskController(req, res) {
  try {
    const userId = req.user.id;

    const taskId = req.params.id;
    const task = await taskModel.findById(taskId);

    if(!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      })
    }

    if(task.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access'
      })
    }

    const result = await taskModel.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      result
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
};

module.exports = {
    createTaskController,
    getAllUsersTaskController,
    getSingleTaskController,
    updateTaskController,
    deleteTaskController
}