const express = require('express');
const router = express.Router();

const { createTaskController, getAllUsersTaskController, getSingleTaskController, updateTaskController, deleteTaskController } = require('../controllers/taskController');
const { jwtMiddleware } = require('../middlewares/jwtMiddleware');

router.post('/', jwtMiddleware, createTaskController);
router.get('/', getAllUsersTaskController);
router.get('/:id', getSingleTaskController);
router.put('/:id', updateTaskController);
router.delete('/:id', deleteTaskController);

module.exports = router;