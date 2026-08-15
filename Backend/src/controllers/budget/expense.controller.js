import ApiError from "../../utils/ApiError.js"
import asyncHandler from "../../utils/asyncHandler.js"
import { Users } from "../../models/users.models.js"
import { Expense } from "../../models/budget/expense.models.js"
import ApiResponse from "../../utils/ApiResponse.js"
import { ExpenseTracker } from "../../service/expense.service.js"
import { paginate } from "../../utils/pagination.js"

const fieldCheck = (fields) => {
    return fields.some(field => {
        if (typeof field === 'string') {
            return !field || field.trim() === ""
        }
        return !field  // For numbers, null, undefined, etc.
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
const updatedBudget = asyncHandler(async(req,res)=> {
    const {budget} = req.body

    const user = await Users.findById(req.user._id)
    const isPrevBudget = user.budget > 0? true : false
    user.budget = user.budget + budget
    const updatedBudget = await user.save({validateBeforeSave : false})
    if(!updatedBudget){
        throw new ApiError(500 , "Failed to save user budget")
    }
    return res.status(200)
    .json(
        new ApiResponse(200 , isPrevBudget? "budget update,previous budget added" : "budget updated" , updatedBudget)
    )
})
const createExpense = asyncHandler(async (req, res) => {
    //if there is any loan,goal,
    //if there a budget
    //deduct the amt saved for loan and goals from budget
    //in loans and goals section
    //check the spending trends of user->(frontend)

    const { name, amount, category } = req.body
    const check = fieldCheck([name, category])

    if (check) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await Users.findById(req.user._id)
    const userBudget = user.budget
    if (!userBudget) {
        throw new ApiError(404, "No budget found")
    }
    const manageExpense = new ExpenseTracker(userBudget, req.user._id)
    const createExpense = await manageExpense.addExpense(name, amount, category)
    const { updatedBudget, totalSpend } = await manageExpense.getAndSaveRemainingBudget()
    console.log("create expense :", createExpense)
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
    const { page = 1, limit = 10, sortBy, sortType, userId } = req.query
    const options = {
        page,
        limit,
        sortBy,
        sortType,
        userId
    }
    const getAllExpenses = await paginate(Expense, options)
    if (!getAllExpenses) {
        throw new ApiError(400, "No Expense found")
    }
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
    const user = await Users.findById(req.user._id)
    const expense = new ExpenseTracker(user.budget, user._id)
    const { message, restoreBudget, newBudget } = await expense.delExpense(expenseId, ans1, ans2)
    return res.status(200)
        .json(
            new ApiResponse(200, message, { restoreBudget, newBudget })
        )


})
const getExpenseCategory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType, category } = req.query
    const options = {
        page,
        limit,
        sortBy,
        sortType,
        category
    }
    const getExpense = await paginate(Expense, options)
    if (!getExpense) {
        throw new ApiError(400, "No expenses found by category")
    }
    return res.status(200)
        .json(
            new ApiResponse(200, "Expense fetched by category", getExpenses)
        )
})
const getExpenseById = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType, id } = req.query
    const options = {
        page,
        limit,
        sortBy,
        sortType,
        id
    }
    const getExpense = await paginate(Expense, options)
    if (!getExpense) {
        throw new ApiError(400, "No Expense Found by id.")
    }
    return res.status(200)
        .json(
            new ApiResponse(200, "Expense fetched by id", getExpense)
        )
})

export {
    getBudget,
    createExpense,
    editExpense,
    deleteExpense,
    showAllExpense,
    getExpenseById,
    getExpenseCategory,
}