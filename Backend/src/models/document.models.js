import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    document : {
        type : String,
        required : true
    }

    
} ,{
    timestamps : true
})

export const Document = new mongoose.model("Document" , documentSchema)