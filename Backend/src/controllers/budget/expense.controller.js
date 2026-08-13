import ApiError from "../../utils/ApiError"
import asyncHandler from "../../utils/asyncHandler"
import { Users } from "../../models/users.models"
import { Expense } from "../../models/budget/expense.models"
import ApiResponse from "../../utils/ApiResponse"
import { ExpenseTracker } from "../../service/expense.service"
const fieldCheck = (arr) => {
    arr.some((fields) => {
        return fields === "" || fields.trim() === ""
    })
}
const getBudget = asyncHandler(async (req, res) => {
    const user = await Users.findById(req.user._id)
    if (!user && !user.budget) {
        throw new ApiError(400, "No user budget found")
    }
    return res.status(200)
        .json(
            new ApiResponse(200, "fetched user budget", user.budget)
        )
})
const createExpense = asyncHandler(async (req, res) => {
    //if there is any loan,goal,
    //if there a budget
    //deduct the amt saved for loan and goals from budget
    //in loans and goals section
    //check the spending trends of user->(frontend)

    const { name, amount, category } = req.body
    const check = fieldCheck([name, amount])
    if (check) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await Users.findById(req.user._id)
    const userBudget = user.budget
    const manageExpense = new ExpenseTracker(userBudget, req.user._id)
    const { updatedBudget, totalSpend } = await expense.getAndSaveRemainingBudget()
    const createExpense = await manageExpense.addExpense(name, category, amount)

    return res.status(200)
        .json(
            new ApiResponse(200, "Expense created", { createExpense, updatedBudget, totalSpend })
        )

})

const editExpense = asyncHandler(async (req, res) => {
    const { name, amount, category } = req.body
    const { expenseId } = req.params
    const check = fieldCheck([name, amount])
    if (check) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await Users.findById(req.user._id)
    const userBudget = user.budget
    const expense = new ExpenseTracker(userBudget, req.user._id)
    const updateExpense = await expense.editExpense(expenseId, name, category, amount)
    const { updatedBudget, totalSpend } = await expense.getAndSaveRemainingBudget()
    return res.status(200)
        .json(
            new ApiResponse(200, "Expense created", { updateExpense, updatedBudget, totalSpend })
        )
})

const showAllExpense = asyncHandler(async (req, res) => {
    const user = await Users.findById(req.user._id)

    const expense = new ExpenseTracker(user.budget, user._id)
    const allExpenses = await expense.getAllExpense()

    return res.status(200)
        .json(
            new ApiResponse(200, "fetched user expenses", allExpenses)
        )
})

const deleteExpense = asyncHandler(async (req, res) => {
    //delete accidently or refund
    //Q1 : Did money actually leave your account for this?
    //Q2 : Did you receive money back (a refund)
    const { expenseId } = req.params
    const { ans1, ans2 } = req.body
    if (ans1 && ans1 === "No" && !ans2) {
        ans2 = "No"
    }
    const validAns = ["Yes", "No"]
    if (!validAns.includes(ans1) && !validAns.includes(ans2)) {
        throw new ApiError(400, "Ans must be Yes/No")
    }
    const DELETION_RULES = {
        "No_No": { action: "HARD_DELETE", restoreBudget: true, },
        "No_Yes": { action: "HARD_DELETE", restoreBudget: true, }, // Invalid combo defaults to safe delete
        "Yes_Yes": { action: "STORE_HISTORY", restoreBudget: true, },
        "Yes_No": { action: "STORE_HISTORY", restoreBudget: false, }
    };

    const key = DELETION_RULES[`${ans1}_${ans2}`]

    const expense = await Expense.findById(expenseId)
    if (!expense) {
        throw new ApiError(400, "Expense not found through Id")
    }
    if (key.restoreBudget) {
        const incsBudget = await Users.findByIdAndUpdate(req.user._id, {
            $inc: { budget: expense.amount }
        });
    }

    if (key.action === "HARD_DELETE") {
        const delExpense = await Expense.findByIdAndDelete(expenseId)
    } else {
        //expenseId
        const History = await History.create({
            expenses: expenseId
        })
    }

})