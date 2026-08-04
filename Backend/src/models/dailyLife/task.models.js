import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Users", 
        required : true
    },
    taskName : {
        type : String,
        required : true,
    },
    status : {
        type : String,
        required : true,
        default : "Pending",
        enum : ["Pending" , "Completed" , "Deleted"]
    },
    reminder : {
        type : Date,
    },
    document : {
        type : String, // cloudinary url
    }
} , {
    timestamps : true
})

export const Task = mongoose.model("Task" , taskSchema)