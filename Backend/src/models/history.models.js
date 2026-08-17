import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  
        required: true,
        ref: "Users"
    },
    routine: {
        type: mongoose.Schema.Types.ObjectId, //get all routines 
        ref: "Routine"
    },
    expenses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense", //add this in history after month end
    },
    loans: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Loan"
    },
    goals: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Goal"
    },
    tasks: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }
}, {
    timestamps: true
})
export const History = mongoose.model("History", historySchema)
