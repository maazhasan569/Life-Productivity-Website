import ApiError from "../utils/ApiError"
import { Expense } from "../models/budget/expense.models"
import { Users } from "../models/users.models"
export class ExpenseTracker {
    constructor(budget, userId) {
        if (!this.budget || this.budget <= 0) {
            throw new ApiError(400, "Invalid budget")
        }
        if (!userId) {
            throw new ApiError(400, "No user Id")
        }
        this.budget = budget,
            this.userId = userId

    }
    async addExpense(name, category = "General", amount) {
        if (!amount || amount <= 0) {
            throw new ApiError(400, "Invalid expense amount")
        }

        if (amount > this.budget) {
            throw new ApiError(400, "Expense amount exceeds budget")
        }
        try {
            const createExpense = await Expense({
                userId: this.userId,
                amount,
                category,
                name,
            })
        } catch (error) {
            throw new ApiError(500, error.msg)
        }
        return createExpense
    }
    async editExpense(name, category = "General", amount) {
        if (!amount || amount <= 0) {
            throw new ApiError(400, "Invalid budget")
        }

        if (amount > this.budget) {
            throw new ApiError(400, "Expense amount exceeds budget")
        }
        try {
            const updateUserExpense = await Expense.findByIdAndUpdate(
                this.userId,
                {
                    amount,
                    category,
                    name
                }
            )

        } catch (error) {
            throw new ApiError(500, error.msg)
        }
        return updateUserExpense
    }
    getTotalSpend() {
        return this.expenses.reduce((total, exp) => total + exp.amount, 0);
    }
    async getAndSaveRemainingBudget() {
        try{
            const user = await Users.findByIdAndUpdate(
            this.userId,
            {
                budget: this.budget - this.getTotalSpend
            },
            { new: true }
        )
    }catch(error){
        throw new ApiError(500 , error.msg)
    }
        return user.budget
    }
}