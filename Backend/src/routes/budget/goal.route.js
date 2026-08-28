import { Router } from "express";
import {
    createGoal,
    getAllGoals,
    getGoalById,
    getGoalsByCategory,
    delGoal,
    autoDeductAmt,
    manualDeduction,
    totalGoalsAmtPaid,
    totalGoalsAmtRemaining,
} from "../../controllers/budget/goal.controller.js";
import { verfiyJWTAccessToken } from "../../middlewares/verifyJWT.middleware.js";


const router = Router()
router.route("/create-goal").post(verfiyJWTAccessToken,createGoal)
router.route("/:id").get(verfiyJWTAccessToken,getGoalById)
router.route("/").get(verfiyJWTAccessToken,getAllGoals)
router.route("/category").get(verfiyJWTAccessToken,getGoalsByCategory)
router.route("/:id").delete(verfiyJWTAccessToken,delGoal)
router.route("/auto-deduct").post(verfiyJWTAccessToken,autoDeductAmt)
router.route("/manual-deduct").post(verfiyJWTAccessToken,manualDeduction)
router.route("/amt-paid").get(verfiyJWTAccessToken,totalGoalsAmtPaid)
router.route("/amt-remaining").get(verfiyJWTAccessToken,totalGoalsAmtRemaining)

export default router
