import { Users } from "../../models/users.model";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import bcrpt from "bcrypt"
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await Users.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validiateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, error.msg)
    }
}

const options = {
    httpOnly: true,
    secure: true
}
const createUserAccount = asyncHandler((req, res) => {
    const { email, password } = req.body;
    [email, password].some((inpFields) => {
        if (!inpFields || inpFields.trim() === "") {
            throw new ApiError(400, "enter all details")
        }
    })

    const isUserfound = Users.findOne({
        $or: [{ email }, { password }]
    })

    if (isUserfound) {
        throw new ApiError(400,
            isUserfound.email === email ? "Email already in use"
                : "password already in use"
        )
    }
    if (!isUserfound) {
        throw new ApiError
    }
    const user = await user.create({
        email,
        password,
    }).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(500, "error occured while creating the user")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    return res.status(
        201
    ).cookie(
        "accessToken", accessToken, options
    ).cookie(
        "refreshToken", refreshToken, options
    ).json(
        new ApiResponse(201, "User created", { user, accessToken })
    )

})

const logInUser = asyncHandler((req, res) => {
    //check user by comparing his email
    //hash user eneterd password 
    //compare with db password
    //return which details is correct
    //and which is not
    const { email, password } = req.body;


    const isUserPasswordValid = await isPasswordValid(password)
    if (!isUserPasswordValid) {
        throw new ApiError(404, "User not found by password")
    }

    const getUserByEmail = await Users.findOne({ email }).select("-password -refreshToken")
    if (!getUserByEmail) {
        throw new ApiError(404, "User not found by email")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken()
    return res.status(200)
        .cookie(
            "accessToken", accessToken, options
        ).cookie(
            "refreshToken", refreshToken, options
        ).json(
            new ApiResponse(201, "user found", { getUserByEmail, accessToken })
        )


})