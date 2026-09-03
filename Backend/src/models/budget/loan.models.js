import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    loanName :{
        type : String,
    },
    category : {
        type : String,
        default : "General"
    },
    loanType : {
        type : String,
        enum : ["Monthly" , "Yearly"]
    },
    loanAmt : {
        type : Number,
        required : true
    },
    currentAmt :{
        type : Number,
        required : true
    },
    dueDate : {
        type : Date,
    },
    autoDeduction : {
        type : Boolean,
        default : false
    }
    
    
}, {
    timestamps: true
})

export const Loan = mongoose.model("Loan" , loanSchema)