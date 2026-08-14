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
    if (ans1 === "No" && !ans2) {
        ans2 = "No";
    }

    const validAnswers = ["Yes", "No"];
    if (!validAnswers.includes(ans1) || !validAnswers.includes(ans2)) {
        throw new ApiError(400, "Answers must be 'Yes' or 'No'");
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
        throw new ApiError(404, "Expense not found");
    }
    const DELETION_RULES = {
        "No_No": { action: "HARD_DELETE", restoreBudget: true },
        "No_Yes": { action: "HARD_DELETE", restoreBudget: true },
        "Yes_Yes": { action: "STORE_HISTORY", restoreBudget: true },
        "Yes_No": { action: "STORE_HISTORY", restoreBudget: false }
    };

    const rule = DELETION_RULES[`${ans1}_${ans2}`];

    if (rule.restoreBudget) {
        await Users.findByIdAndUpdate(this.userId, {
            $inc: { budget: expense.amount } // Safely restores budget
        });
    }


    if (rule.action === "HARD_DELETE") {
        await Expense.findByIdAndDelete(expenseId);
        return { message: "Expense permanently deleted", restoredBudget: rule.restoreBudget };
    } else {

        await History.create({ expenseId: expense._id, userId: this.userId });
        await Expense.findByIdAndDelete(expenseId);
        return { message: "Expense archived to history", restoredBudget: rule.restoreBudget };
    }
})

