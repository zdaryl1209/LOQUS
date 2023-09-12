const Task = require('../model/Task');
const mongoose = require('mongoose');

const getAllTasks = async (req, res) => {
    const pageSize = req?.params?.pageSize ? req?.params?.pageSize : null;
    const pageNumber = req?.params?.pageNumber ? req?.params?.pageNumber : null;
    const completedTasks = req?.query?.completed;
    const sortTasks = req?.query?.sort;
    const usePagination = !pageNumber ? false : true;

    //create the filter if only completed (or incomplete) tasks are to be shown 
    let filters = {}
    if(completedTasks != undefined)
    {
        filters.completed = completedTasks
    }

    //create the sorting criteria if the results need to be sorted a certain way
    let sortCriteria = {}
    if(sortTasks != undefined)
    {
        switch(sortTasks){
            case "due_date":
            case "due_date_asc":
                sortCriteria.due_date = 1;
                break;
            case "due_date_desc":
                sortCriteria.due_date = -1;
                break;
            case "completed":
            case "completed_asc":
            case "incomplete_desc":
                sortCriteria.completed = -1;
                break;
            case "incomplete":
            case "incomplete_asc":
            case "completed_desc":
                sortCriteria.completed = 1;
                break;
        }
    }
    
    //get the tasks given the criteria placed above
    const tasks = await Task.paginate(
        { ...filters },
        { 
            pagination: usePagination,
            page: pageNumber,
            limit: pageSize,
            sort: sortCriteria
        })
        .then(function (result)
    {
        if(result.docs.length == 0)
        {
            return res.sendStatus(204); //No Content
        }

        res.json(result.docs);
    });
}

//Ensure that all required fields are filled during creation
const createNewTask = async (req, res) => {
    if(!req?.body?.title || req?.body?.title.trim().length === 0)
    {
        return res.status(400).json({
            message: 'Task Title is required'
        });
    }
    if(!req?.body?.due_date || req?.body?.due_date.trim().length === 0)
    {
        return res.status(400).json({
            message: 'Task Due Date is required'
        });
    }

    try
    {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            due_date: req.body.due_date,
            completed: req.body.completed
        });

        res.status(201).json(task);
    }
    catch (err)
    {
        console.error(err);
    }
}

const updateExistingTask = async (req, res) => {
    if(!req?.body?.id)
    {
        //Bad Request
        return res.status(400).json({
            message: `Task ID is required`
        });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.id))
    {
        //Bad Request
        return res.status(400).json({ message: 'Invalid ID structure' });
    }

    const task = await Task.findOne({ _id: req.body.id}).exec();

    if(!task)
    {
        //No Content
        return res.sendStatus(204);
    }

    if(req.body.title && req.body.title.trim().length !== 0)
    {
        task.title = req.body.title;
    }
    if(req.body.description)
    {
        task.description = req.body.description;
    }
    if(req.body.due_date && req.body.title.trim().length !== 0)
    {
        task.due_date = req.body.due_date;
    }
    if(req.body.completed)
    {
        task.completed = req.body.completed;
    }

    const result = await task.save();
    
    res.json(result);
}

const deleteTask = async (req, res) => {
    if(!req?.body?.id)
    {
        // Bad Request
        return res.status(400).json({
            message: `Task ID is required`
        });
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.id))
    {
        //Bad Request
        return res.status(400).json({ message: 'Invalid ID structure' });
    }

    const task = await Task.findOne({ _id: req.body.id}).exec();

    if(!task)
    {
        //No Content
        return res.sendStatus(204);
    }

    const result = await task.deleteOne({_id: req.body.id});
    res.json(result);
}

const getTaskByID = async (req, res) => {
    if(!req?.params?.id)
    {
        return res.status(400).json({
            message: `Task ID is required`
        });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
    {
        return res.status(400).json({ message: 'Invalid ID structure' });
    }

    const task = await Task.findOne({ _id: req.params.id} ).exec();

    if(!task)
    {
        return res.sendStatus(204);
    }

    res.json(task);
}

module.exports = {
    getAllTasks,
    createNewTask,
    updateExistingTask,
    deleteTask,
    getTaskByID
}