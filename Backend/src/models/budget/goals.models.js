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
        required : true,
        default : 0
    },
    status : {
        type : String,
        default : "Working",
        enum : {
            values : ["InProgress" , "Paused", "Abondened" , "Achieved"],
            message : "InProgress , Paused , Abondened , Achieved are acceptable"
        }
    },
    type : {
        type : String,
        enum : {
            values : ["Monthly" , "Yearly"],
            message : "Only Monthly or Yearly goals are valid"
        }
    },
    category : {
        type : String,
        default : "General"
    },
    autoDeduction : {
        type : Boolean,
        default : false
    },
    totalDeductions : {
        type : Number,
        default : 0
    },
    lastDeduction: {
        type : Date
    },
    deductionDay:{
        type : Date
    }

}, {
    timestamps: true
})

export const Goal = mongoose.model("Goal" , goalsSchema)