import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const usersSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        lowercase : true
    },
    password: {
        type: String,
        sparse : true
        
    },
    email: {
        type: String,
        unique: true,
        lowercase : true
    },
    avatar: {
        type: String, // cloudinary url
    },

    refreshToken: {
        type: String,
        default : null,
        sparse : true
    },
    googleRefreshToken: {
        type: String,
        default : null,
        sparse : true
    },
    googleId : {
        type : String,
        default : null,
        unique : true,
        sparse : true
    }
},
    { timestamps: true })

usersSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    await bcrypt.hash(this.password, 10)
})

usersSchema.method.isPasswordValid = async function (password) {
    await bcrypt.compare(password, this.password)
}

usersSchema.method.generateAccessToken = function () {

    return jwt.sign(
        {
            username: this.username,
            password: this.password,
            email: this.email,
            avatar: this.avatar,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    )
}
usersSchema.method.generateRefreshToken = function () {

    return jwt.sign(
        {
            userId: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    )
}