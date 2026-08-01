import { Router } from "express"
import {
    createUserAccount,
    logInUser,
    getNewAccessToken,
    logOut
} from "../controllers/auth/auth.controller"
import {
    loginUrl,
    registorUrl,
    loginOrRegistorGoogleUser
} from "../controllers/auth/oAuth2.controller"
import { verfiyJWTAccessToken } from "../middlewares/verifyJWT.middleware"
const router = Router()

router.route("/create-account").post(createUserAccount)
router.route("/login").post(logInUser)
router.route("/refresh-token").get(getNewAccessToken)
router.route("/google/registor").post(loginUrl)
router.route("/google/login").post(registorUrl)
router.route("/google/callback").post(loginOrRegistorGoogleUser)
router.route("/logout").post(verfiyJWTAccessToken,logOut)
