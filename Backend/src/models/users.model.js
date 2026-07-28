import mongoose from "mongoose"

const usersSchema = new mongoose.Schema({

    username : {
        type : String,
        unique : true,
    },
    password : {
        type : String,
        unique : true
    },
    email : {
        type : String,
        unique : true
    },
    avatar : {
        type : String,
        required : true,
    },

    refreshToken : {
        type : String,
    },
    googleRefreshToken : {
        type : String
    }
},
    { timestamps: true })