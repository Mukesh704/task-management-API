const taskModel = require('../models/task');

async function createTaskController(req, res) {
    try {
        const tokenData = req.user;``
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

function getAllUsersTaskController(req, res) {};

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