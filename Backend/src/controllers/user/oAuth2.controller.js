import {oAuth2Client} from "google-auth-library"
import asyncHandler from "../../utils/asyncHandler"


const loginInUrl = asyncHandler((req,res) => {
const oauthClient = new oAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECION_UR
)

const authUrl = oauthClient.generateAuthUrl({
    access_type : "offline",
    prompt : "consent",
    scope : [
        "openid",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ]
})

    res.redirect(authUrl)
})