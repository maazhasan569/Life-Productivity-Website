import mongoose from "mongoose";

const documentSchema = new mongoose.model({
    document : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true,
    },
    publicId : {
        type : String,
        required : true
    }
    
} ,{
    timestamps : true
})

export const Document = new mongoose.model("Document" , documentSchema)