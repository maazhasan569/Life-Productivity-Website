import asyncHandler from "../utils/asyncHandler.js";
import { TaskService } from "../service/task.service.js";
import ApiResponse from "../utils/ApiResponse.js";


const createTask = asyncHandler(async(req,res) => {

    const fileFieldName = req.file?.fieldname?.toLowerCase()
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
        fileFieldName,
    })

    const newTask = await task.createTask()
    console.log("runing...2222")
    return res.status(200)
    .json(
        new ApiResponse(200 , "new task created" , newTask)
    )
})

const editTask = asyncHandler(async(req,res)=> {

    const fileFieldName = req.file.fieldname?.toLowerCase()
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
        fileFieldName,
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

const markTaskOverDue = asyncHandler(async(req,res)=>{

    const userId = req.user._id
    const {taskId} = req.params

    const task = new TaskService(userId)
    const updateTaskStatus = await task.setTaskOverDue(taskId)

    return res.status(200)
    .json(
        new ApiResponse(200 , "task status marked to overdue" , updateTaskStatus)
    )

})

export {
    createTask,
    editTask,
    deleteTask,
    markTaskComplete,
    markTaskOverDue,
}