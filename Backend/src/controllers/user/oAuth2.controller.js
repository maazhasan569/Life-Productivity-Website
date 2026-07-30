import { oAuth2Client } from "google-auth-library"
import asyncHandler from "../../utils/asyncHandler"
import { verify } from "jsonwebtoken"
import { Users } from "../../models/users.model"
import ApiError from "../../utils/ApiError"
import ApiResponse from "../../utils/ApiResponse"
import { generateAccessAndRefreshToken } from "../../utils/generateJwtToken"

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
    if (!code) {
        throw new ApiError(401, "auth code not found")
    }
    const { tokens } = await oauthClient.getToken(code)
    const {access_token, refresh_token} = tokens
    oauthClient.setCredentials(tokens)
    const ticket = oauthClient.verifyIdToken(
        {
            idToken: tokens._id.token,
            audience: process.env.CLIENT_ID
        }
    )

    const payload = ticket.getPayload()
    const isUserExist = await Users.find({googleId : payload.sub})
    if(isUserExist){
        return res.status(204).json(
            new ApiResponse(204 , "user already exists")
        )
    }

    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(createdUser._id)
    const createdUser = await Users.create({
        googleId : payload.sub,
        username : payload.name,
        email : payload.email,
        googleRefreshToken : refresh_token,
        refreshToken : refreshToken
    })

    if(!createdUser){
        throw new ApiError(500 , "failed to create the user" )
    }
    return res.status(201)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(201 ,"user created", {createdUser , googleAccessToken : access_token , accessToken })
    )

})
export {
    oauthClient,
    loginUrl
}