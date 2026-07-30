import { oAuth2Client } from "google-auth-library"
import asyncHandler from "../../utils/asyncHandler"
import { verify } from "jsonwebtoken"
import { Users } from "../../models/users.model"
import ApiError from "../../utils/ApiError"
import ApiResponse from "../../utils/ApiResponse"
import { generateAccessAndRefreshToken } from "../../utils/generateJwtToken"

const getGoogleTokenAndPayload = async (code) => {

    try {
        if (!code) {
            throw new ApiError(401, "auth code not found")
        }
        const { tokens } = await oauthClient.getToken(code)
        oauthClient.setCredentials(tokens)
        const ticket = oauthClient.verifyIdToken(
            {
                idToken: tokens._id.token,
                audience: process.env.CLIENT_ID
            }
        )
        const payload = ticket.getPayload()
    } catch (err) {
        throw new ApiError(401, "unauthorized token or expired")
    }
    return { payload, refresh_token: tokens.refresh_token, access_token: tokens.access_token }
}
const oauthClient = new oAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECION_UR
)

const options = {
    httpOnly: true,
    secure: true
}
const loginUrl = asyncHandler((req, res) => {

    const authUrl = oauthClient.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "openid",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ]
    })

    res.redirect(authUrl)
})

const registorGoogleUser = asyncHandler((req, res, next) => {
    const { code } = req.query;
    const { payload, refresh_token, access_token } = await getGoogleTokenAndPayload(code)
    const isUserExist = await Users.find({ googleId: payload.sub })
    if (isUserExist) {
        return res.status(204).json(
            new ApiResponse(204, "user already exists")
        )
    }
    const createdUser = await Users.create({
        googleId: payload.sub,
        username: payload.name,
        email: payload.email,
        googleRefreshToken: refresh_token,
    })
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(createdUser._id)
    if (!createdUser) {
        throw new ApiError(500, "failed to create the user")
    }
    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(201, "user created", { createdUser, googleAccessToken: access_token, accessToken })
        )

})

const loginGoogleUser = asyncHandler(async (req, res) => {
    //get the auth code
    //apply token func
    //check if account exists

    const { code } = req.query;
    const { payload, refresh_token, access_token } = await getGoogleTokenAndPayload(code)
    const user = await Users.findOne({ googleId: payload.sub })
    if (!user) {
        throw new ApiError(404, "User account not found")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    user.googleRefreshToken = refresh_token
    await user.save({ validiateBeforeSave: false })

    return res.status(200)
        .cookie(
            "accessToken", accessToken, options
        )
        .cookie(
            "refreshToken", refreshToken, options
        ).json(
            new ApiResponse(200, "user logged in successfully", {
                loggedInUser: user,
                accessToken,
                googleAccessToken: access_token
            })
        )


})
export {
    loginUrl,
    loginGoogleUser,
    registorGoogleUser
}