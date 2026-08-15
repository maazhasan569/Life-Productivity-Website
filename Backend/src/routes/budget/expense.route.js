import { Router } from "express";
import {
     getBudget,
     createExpense,
     editExpense,
     showAllExpense,
     getExpenseCategory,
     getExpenseById,
     deleteExpense

} from "../../controllers/budget/expense.controller.js";
import { verfiyJWTAccessToken } from "../../middlewares/verifyJWT.middleware.js";
const router = Router()
router.route("/").get(verfiyJWTAccessToken,showAllExpense)
router.route("/budget").get(verfiyJWTAccessToken,getBudget)
router.route("/create-expense").post(verfiyJWTAccessToken,createExpense)
router.route("/edit-expense").put(verfiyJWTAccessToken,editExpense)

router.route("/:expenseCategory").get(verfiyJWTAccessToken,getExpenseCategory)
router.route("/:expenseId").get(verfiyJWTAccessToken,getExpenseById)
router.route("/:expenseId").delete(verfiyJWTAccessToken,deleteExpense)
export default router