import asyncHandler from "../utils/asyncHandler";
import { TaskService } from "../service/task.service";
import ApiResponse from "../utils/ApiResponse";


const createTask = asyncHandler(async(req,res) => {
    const fileType = req.body.type?.toLowerCase()
    const filePath = req.filePath
    const {
        taskName,
        taskDescription,
        category,
        dateValue,
        dueDateUnit 
    } = req.body
    const userId = req.user._id

    const task = new TaskService(userId , {
        taskName,
        taskDescription,
        category,
        dateValue,
        dueDateUnit,
        filePath,
        fileType,
    })

    const newTask = await task.createTask()

    return res.status(200)
    .json(
        new ApiResponse(200 , "new task created" , newTask)
    )
})

const editTask = asyncHandler(async(req,res)=> {

    const fileType = req.body.type?.toLowerCase()
    const filePath = req.filePath
    const {
        taskName,
        taskDescription,
        category,
        dateValue,
        dueDateUnit 
    } = req.body
    const userId = req.user._id
    const {taskId} = req.params


    const task = new TaskService(userId , {
        taskName,
        taskDescription,
        category,
        dateValue,
        dueDateUnit,
        filePath,
        fileType,
    })

    
    const updatedTask = await task.editTask(taskId)

    res.status(200)
    .json(
        new ApiResponse(200 , "task updated" , updatedTask)
    )
})

const deleteTask = asyncHandler(async (req,res) =>{
    const userId = req.user._id
    const {taskId} = req.params


    const task = new TaskService(userId)

    const deletedTask = await task.delTask(taskId)

    res.status(200)
    .json(
        new ApiResponse(200 , "task deleted" , deletedTask)
    )
})

const markTaskComplete = asyncHandler(async(req,res)=> {

    const userId = req.user._id
    const {taskId} = req.params

    const task = new TaskService(userId)
    const updateTaskStatus = task.setTaskCompleted(taskId)

    return res.status(200)
    .json(
        new ApiResponse(200 , "task status marked to complete" , updateTaskStatus)
    )
})
