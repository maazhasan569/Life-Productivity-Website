import {Router} from "express"
import { 
    createUserAccount,
    logInUser,
    getNewAccessToken
} from "../controllers/auth/auth.controller"
import { 
    loginUrl,
    loginGoogleUser,
    registorGoogleUser
 } from "../controllers/auth/oAuth2.controller"

const router = Router()

router.post("/create-account").post(createUserAccount)
router.post("/login").post(logInUser)
router.post("/refresh-token").get(getNewAccessToken)
router.post("/google")