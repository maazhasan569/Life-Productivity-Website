import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Users", 
        required : true
    },
    name : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    category : {
        type : String,
        default : "General"
    },
    status : {
        type : String,
        required : true,
        default : "in_progress",
        enum : ["in_progress" , "Completed" , "Deleted"]
    },
    dueDate : {
        type : Date,
    },
    document : {
        type : String, // cloudinary url
    }
} , {
    timestamps : true
})

export const Task = mongoose.model("Task" , taskSchema)