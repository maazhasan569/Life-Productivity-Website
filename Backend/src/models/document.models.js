import mongoose from "mongoose";

const documentSchema = new mongoose.model({
    document : {
        type : String,
        required : true
    }
    
    
} ,{
    timestamps : true
})