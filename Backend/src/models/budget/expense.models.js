import mongoose from "mongoose";
const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Users",
        required: true
    },
    amount : {
        type : Number,
        required : true,
    },
    category : {
        type : String,
        required : true
    },
    // salary : {
    //     type : Number,
    //     enum : ["monthly" , "yearly"]
    // }
} , {timestamps : true})

export const Expense = mongoose.model("Expense" , expenseSchema)