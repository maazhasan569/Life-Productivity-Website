import ApiError from "../utils/ApiError"
import { Task } from "../models/dailyLife/task.models"
import { isValidObjectId } from "mongoose"
class TaskService{
    constructor(userId ,config = {}){
        this.userId = userId
        this.taskName = config.taskName,
        this.taskDescription = config.taskDescription
        this.category = config.category
    }

    async createTask(){
        try{
            if(!this.taskName){
            throw new ApiError(400 , "task name is required")
        }

        const newTask = await Task.create({
            userId : this.userId,
            name : this.taskName,
            description : this.taskDescription,
            category : this.category
            //document and due date to be added
        })
        return newTask
        }catch(err){
            throw new ApiError(500 , err.message )
        }
    }

    async editTask(taskId){
        if(!taskId){
            throw new ApiError(400 , "task id not found")
        }

        if(!isValidObjectId(taskId)){
            throw new ApiError(400 , "Invalid task id")
        }
    }
}