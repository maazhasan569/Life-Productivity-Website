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

import app from "../../app.js";
const router = Router()
app.use(verfiyJWTAccessToken)

router.route("/create-goal").post(createGoal)
router.route("/:id").get(getGoalById)
router.route("/").get(getAllGoals)
router.route("/category").get(getGoalsByCategory)
router.route("/:id").delete(delGoal)
router.route("/auto-deduct").post(autoDeductAmt)
router.route("/manual-deduct").post(manualDeduction)
router.route("/amt-paid").get(totalGoalsAmtPaid)
router.route("/amt-remaining").get(totalGoalsAmtRemaining)

export default router
