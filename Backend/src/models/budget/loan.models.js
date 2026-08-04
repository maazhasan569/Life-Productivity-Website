import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    loanType : {
        type : String,
        enum : ['Lent' , "Borrowed"]
    },
    loanAmt : {
        type : String,
        required : true
    },
    dueDate : {
        type : Date,
    },
    
    
    
}, {
    timestamps: true
})

export const Loan = mongoose.Schema("Loan" , loanSchema)