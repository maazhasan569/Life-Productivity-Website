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
        ],
        state: 'action=login'
    })

    res.redirect(authUrl)
    return res.status(302)
        .json(
            new ApiResponse(302, "auth url generated", authUrl)
        )
})

const registorUrl = asyncHandler((req, res) => {

    const authUrl = oauthClient.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "openid",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
        state: 'action=registor'
    })

    res.redirect(authUrl)
    return res.status(302)
        .json(
            new ApiResponse(302, "auth url generated", authUrl)
        )
})

const loginOrRegistorGoogleUser = asyncHandler(async (req, res) => {
    //if user logging
    //

    const { code, state } = req.query;
    const { payload, refresh_token, access_token } = await getGoogleTokenAndPayload(code)
    const isUser = await Users.findOne({ googleId: payload.sub })
    if (!isUser && state === 'action=login') {
        throw new ApiError(404, "User account not found")
    }
    if (isUser && state === 'action=registor') {
        throw new ApiError(409, "account already present")
    }
    const user = isUser || await Users.create({
        googleId: payload.sub,
        username: payload.name,
        email: payload.email,
        googleRefreshToken: refresh_token,
    })
    if (!user) {
        throw new ApiError("failed to create new user do ")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    user.googleRefreshToken = refresh_token
    await user.save({ validiateBeforeSave: false })
    const userKeyName = state === 'action=registor' ? "registoredUser" : "loggedInUser"
    return res.status(200)
        .cookie(
            "accessToken", accessToken, options
        )
        .cookie(
            "refreshToken", refreshToken, options
        ).json(
            new ApiResponse(200, "user logged in successfully", {
                [userKeyName]: user,
                accessToken,
                googleAccessToken: access_token
            })
        )


})
export {
    loginUrl,
    registorUrl,
    loginOrRegistorGoogleUser,
}