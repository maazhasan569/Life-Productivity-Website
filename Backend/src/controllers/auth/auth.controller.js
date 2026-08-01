import { Users } from "../../models/users.model";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import bcrpt from "bcrypt"
import { generateAccessAndRefreshToken } from "../../utils/generateJwtToken";
import jwt from "jsonwebtoken"
import { oAuth2Client } from "google-auth-library"
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

const getNewAccessToken = asyncHandler(async (req, res) => {
    //send refresh token from frontend
    //verfiy the token to ensure it is valid
    //get the user thro refreshToken
    //match r-t from frontend with r-t from db
    //if not matched
    //expired or used up
    //handover a new refreshtoken and a accesstoken
    const incomingRefreshToken = req.cookie.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "refresh Token not found in cookie")
    }
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const isUser = await Users.findById(decodedToken._id)
    if (!isUser) {
        throw new ApiError(401, "invalid refresh token")
    }
    if (!(incomingRefreshToken === isUser.refreshToken)) {
        throw new ApiError(401, "refresh token expired or already used")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(isUser._id)
    return res.status(201)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(201, "created new access and refreshToken", { accessToken, refreshToken })
        )
})

//logout user, del jwt and googletokens
const logOut = asyncHandler(async (req, res) => {
    const user = req.user;
    const oAuthClient = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECION_URL
    )
    oAuthClient.setCredentials({refreshToken : user.refreshToken})
    await oAuthClient.revokeCredentials()
    await Users.findByIdAndUpdate(
        user._id,
        {
            refreshToken : null,
            googleRefreshToken : null
        }
    )
    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken" , options)
    .json(
        new ApiResponse(200 , "user logged out", user)
    )
})

export {
    createUserAccount,
    logInUser,
    getNewAccessToken,
    logOut
}