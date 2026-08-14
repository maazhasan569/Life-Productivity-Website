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
            return { updatedBudget: user.budget, totalSpend }
        } catch (error) {
            throw new ApiError(500, error.message)
        }

    }
    async getAllExpense() {
        try {
            const allExpenses = await Expense.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(this.userId)
                    }
                }
            ])
            return allExpenses
        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }
    async getExpenseByCategory(category) {
        try {
            const expenseCategory = await Expense.aggregate([
                {
                    $match: {
                        category
                    }
                }
            ])
            return expenseCategory
        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }
    async delExpense(expenseId ,ans1 , ans2) {
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
        let newBudget;
        if (rule.restoreBudget) {
            newBudget = await Users.findByIdAndUpdate(this.userId, {
                $inc: { budget: expense.amount } // Safely restores budget
            });
        }


        if (rule.action === "HARD_DELETE") {
            await Expense.findByIdAndDelete(expenseId);
            return { message: "Expense permanently deleted", restoredBudget: rule.restoreBudget };
        } else {

            await History.create({ expenseId: expense._id, userId: this.userId });
            await Expense.findByIdAndDelete(expenseId);
            return { message: "Expense archived to history", restoredBudget: rule.restoreBudget, newBudget };
        }
    }



}