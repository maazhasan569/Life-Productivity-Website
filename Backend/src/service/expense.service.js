import ApiError from "../utils/ApiError"
import { Expense } from "../models/budget/expense.models"
import { Users } from "../models/users.models"
export class ExpenseTracker {
    constructor(budget, userId) {
        if (!this.budget || this.budget <= 0) {
            throw new ApiError(400, "Invalid budget")
        }
        if(!userId){
            throw new ApiError(400 , "No user Id")
        }
        this.budget = budget,
            this.userId = userId

    }
    addExpense(name, category = null, amount) {
        if (amount > this.budget || amount <= 0) {
            throw new ApiError(400, "Invalid budget")
        }
        const createExpense = await Expense({
            userId,
            amount,
            category
        })
        if (!createExpense) {
            throw new ApiError(500, "failed to save expense in Db")
        }
        return createExpense
    }
    editExpense(name, category = null, amount) {
        if (amount > this.budget || amount <= 0) {
            throw new ApiError(400, "Invalid budget")
        }
        const updateUserExpense = await Expense.findByIdAndUpdate(
            this.userId,
            {
                amount,
                category,
                name
            }
        )
        if (!updateUserExpense) {
            throw new ApiError(500, "Failed to edit user expense")
        }
        return updateUserExpense
    }
    getTotalSpend() {
        return this.expenses.reduce((total, exp) => total + exp.amount, 0);
    }
    getAndSaveRemainingBudget() {
        const user = await Users.findByIdAndUpdate(
            this.userId,
            {
                budget: this.budget - this.getTotalSpend
            },
            { new: true }
        )
        if (!user) {
            throw new ApiError(500, "Failed to update user budget")
        }
        return user.budget
    }
}