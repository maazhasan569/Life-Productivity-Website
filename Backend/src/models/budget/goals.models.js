import mongoose from "mongoose";

const goalsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    goalName : {
        type : String,
        required : true,

    },
    achievmentDate : {
        type : Date,
        required : true
    },
    status : {
        type : String,
        default : "Working"
    },
    autoDeduction : {
        type : Boolean,
        default : false
    },
    deductionsRemaining : {
        type : Number,
        default : 0
    },
    totalDeductions : {
        type : Number,
        default : 0
    }
}, {
    timestamps: true
})

export const Goal = mongoose.model("Goal" , goalsSchema)