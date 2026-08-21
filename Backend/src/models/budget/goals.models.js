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
    targetAmount :{
        type : Number,
        required : true
    },
    currentAmt : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        default : "Working",
        enum : {
            values : ["InProgress" , "Abondened" , "Achieved"],
            message : "InProgress , Abondened , Achieved are acceptable"
        }
    }

}, {
    timestamps: true
})

export const Goal = mongoose.model("Goal" , goalsSchema)