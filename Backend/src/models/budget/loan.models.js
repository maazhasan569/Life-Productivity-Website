import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    loanType : {
        type : String,
    },
    loanAmt : {
        type : String,
        required : true
    }
    
}, {
    timestamps: true
})