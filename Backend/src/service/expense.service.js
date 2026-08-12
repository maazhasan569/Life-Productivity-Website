import ApiError from "../utils/ApiError"
import { Expense } from "../models/budget/expense.models"
import { Users } from "../models/users.models"
export class ExpenseTracker {
    constructor(budget, userId) {
        if (budget || budget <= 0) {
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
            return createExpense;
        } catch (error) {
            throw new ApiError(500, error.msg)
        }

    }
    async editExpense(expenseId, name, category, amount) {
        if (!amount || amount <= 0) {
            throw new ApiError(400, "Invalid budget")
        }

        if (amount > this.budget) {
            throw new ApiError(400, "Expense amount exceeds budget")
        }
        try {
            const updateUserExpense = await Expense.findByIdAndUpdate(
                expenseId,
                {
                    amount,
                    category,
                    name
                }
            )
            return updateUserExpense;

        } catch (error) {
            throw new ApiError(500, error.msg)
        }

    }
    async getTotalSpend() {
        try {
            const expenses = await Expense.find({ userId: this.userId })
            return expenses.reduce((total, exp) => total + exp.amount, 0)
        } catch (error) {
            throw new ApiError(500, error.message || "Failed to calculate total spend")
        }
    }
    async getAndSaveRemainingBudget() {
        try {
            const totalSpend = this.getTotalSpend()
            const user = await Users.findByIdAndUpdate(
                this.userId,
                {
                    budget: this.budget - totalSpend
                },
                { new: true }
            )
            return {updatedBudget : user.budget , totalSpend}
        } catch (error) {
            throw new ApiError(500, error.message)
        }
        
    }
    async getAllExpense(){
        try{
            const allExpenses = await Expense.aggregate([
                {
                    $match : {
                        userId : new mongoose.Types.ObjectId(this.userId)
                    }
                }
            ])
        }catch(err){
            throw new ApiError(500 , err.message)
        }
    }
    
}