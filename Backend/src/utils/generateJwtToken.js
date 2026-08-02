
import ApiError from "./ApiError.js"
import { Users } from "../models/users.model.js"
export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await Users.findById(userId)
        console.log("user obj = " , user)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validiateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, error)
    }
}