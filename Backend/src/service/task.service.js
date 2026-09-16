import ApiError from "../utils/ApiError"
import { Task } from "../models/dailyLife/task.models"
import { isValidObjectId } from "mongoose"
import pushToHistory from "../utils/pushToHistory"
class TaskService {
    constructor(userId, config = {}) {
        this.userId = userId
        this.taskName = config.taskName,
            this.taskDescription = config.taskDescription
        this.category = config.category
    }

    async createTask() {
        try {
            if (!this.taskName) {
                throw new ApiError(400, "task name is required")
            }

            const newTask = await Task.create({
                userId: this.userId,
                name: this.taskName,
                description: this.taskDescription,
                category: this.category,
                status: "in_progress"
                //document and due date to be added
            })
            return newTask
        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }

    async editTask(taskId) {

        if (!taskId) {
            throw new ApiError(400, "task id not found")
        }

        if (!isValidObjectId(taskId)) {
            throw new ApiError(400, "Invalid task id")
        }
        try {

            if (!this.taskName) {
                throw new ApiError(400, "task name is required")
            }
            const updatedTask = await Task.findOneAndUpdate(
                { _id: taskId },
                {
                    name: this.name,
                    description: this.taskDescription,
                    category: this.category
                },
                { returnDocument: 'after' }
            )

            return updatedTask
        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }

    async delTask(taskId) {
        if (!taskId) {
            throw new ApiError(400, "task id not found")
        }

        if (!isValidObjectId(taskId)) {
            throw new ApiError(400, "Invalid task id")
        }

        try {

            const task = await Task.findById(taskId)
            task.status = "Deleted"
            await task.save()
            const deletedTask = await Task.findByIdAndDelete(taskId)
            return deletedTask

        } catch (err) {
            throw new ApiError(500, err.message)
        }

    }

    async setTaskCompleted(isCompleted){
        //user presses the btn on the frontend
        //an api is called
        // api runs a db query
        //set task as completed if the task is not a due a date task
        //or due date hasnot reached
}

    async changeStatus(){
        //get all the tasks 
        //run crone on them
        //mark task overdue when the due date been reached
    }

    //combine doc servive . to allow adding doc inside todo list

}

    
