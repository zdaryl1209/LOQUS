const express = require('express');
const router = express.Router();
const tasksController = require('../../controllers/tasksController');
const verifyJWT = require('../../middleware/verifyJWT');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(tasksController.getAllTasks) 
    .post(verifyJWT, verifyRoles(ROLES_LIST.Admin), tasksController.createNewTask)
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin), tasksController.updateExistingTask)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), tasksController.deleteTask);

router.route('/:id')
    .get(tasksController.getTaskByID);

router.route('/:pageNumber/:pageSize')
    .get(tasksController.getAllTasks);

module.exports = router;