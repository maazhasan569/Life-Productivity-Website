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
    
    
    
}, {
    timestamps: true
})

export const Loan = mongoose.model("Loan" , loanSchema)