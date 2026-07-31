import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const usersSchema = new mongoose.Schema({

    // username: {
    //     type: String,
    //     unique: true,
    // },
    password: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    avatar: {
        type: String,
        required: true,
    },

    refreshToken: {
        type: String,
    },
    googleRefreshToken: {
        type: String
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
export const Users = mongoose.model("User" , usersSchema)