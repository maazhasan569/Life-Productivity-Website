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
    }
}, {
    timestamps: true
})

export const Goal = mongoose.model("Goal" , goalsSchema)