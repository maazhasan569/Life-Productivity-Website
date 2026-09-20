import asyncHandler from "../utils/asyncHandler";
import { TaskService } from "../service/task.service";


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

    const newTask = new TaskService(userId , {
        taskName,
        taskDescription,
        category,
        dateValue,
        dueDateUnit,
        filePath,
        fileType,
    })
})