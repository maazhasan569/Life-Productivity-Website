import { Expense } from "../models/budget/expense.models";
import { Goal } from "../models/budget/goals.models";
import { Users } from "../models/users.models";
import ApiError from "../utils/ApiError";
import crone from "node-cron"
class Goal {
    constructor(id, config = {}) {
        this.id = id;
        this.name = config.name || null;
        this.targetAmount = config.targetAmount || null;
        this.targetDate = config.targetDate || null;
        this.frequency = config.frequency || 'monthly'; // or 'yearly'
        this.category = config.category || null;
        this.duration = config.duration
        this.autoDeduction = config.autoDeduction
        this.goalAmount = goalAmount
        //user will enter goal name,and amt
        //if goal exceed an x amt of bankbalance gave error(frontend)
        //gave option for monthly or yearly goal
        //make algorithm to suggest user goal deadline

    }
    validiateGoal() {
        const fieldCheck = [this.name, this.targetAmount, this.targetDate, this.frequency].some(() => {
            return fields.some(field => {
                if (typeof field === 'string') {
                    return !field || field.trim() === ""
                }
                return !field
            })
        })
        if (!fieldCheck) {
            throw new ApiError(400, "Enter All fields")
        }


    }
    async createGoal() {
        try {
            const newGoal = await Goal.createGoal({
                userId: this.id,
                goalName: this.goalName,
                achievementDate: this.targetDate,
                targetAmount: this.targetAmount
            })
        } catch (err) {
            throw new ApiError(500, "Failed to create goal")
        }
    }
    getDeadlineTime() {
        const now = new Date();
        const target = new Date(this.targetDate);

        const yearDiff = target.getFullYear() - now.getFullYear();
        const monthDiff = target.getMonth() - now.getMonth();

        const totalMonths = yearDiff * 12 + monthDiff;
        return totalMonths
    }
    deductAmount() {
        const deadline = this.getDeadlineTime
        const deductAmt = this.targetAmount / deadline.totalMonths

        if (this.autoDeduction) {

        }

    }
    deadLineAlert() {

    }

}

import { Expense } from "../models/budget/expense.models";
import { Goal } from "../models/budget/goals.models";
import { Users } from "../models/users.models";
import ApiError from "../utils/ApiError";
class Goal {
    constructor(id, config = {}) {
        this.id = id;
        this.name = config.name || null;
        this.targetAmount = config.targetAmount || null;
        this.targetDate = config.targetDate || null;
        this.frequency = config.frequency || 'monthly'; // or 'yearly'
        this.category = config.category || null;
        this.duration = config.duration
        this.autoDeduction = config.autoDeduction
        this.goalAmount = goalAmount
        //user will enter goal name,and amt
        //if goal exceed an x amt of bankbalance gave error(frontend)
        //gave option for monthly or yearly goal
        //make algorithm to suggest user goal deadline

    }
    validiateGoal() {
        const fieldCheck = [this.name, this.targetAmount, this.targetDate, this.frequency].some(() => {
            return fields.some(field => {
                if (typeof field === 'string') {
                    return !field || field.trim() === ""
                }
                return !field
            })
        })
        if (!fieldCheck) {
            throw new ApiError(400, "Enter All fields")
        }


    }
    async createGoal() {
        try {
            const newGoal = await Goal.createGoal({
                userId: this.id,
                goalName: this.goalName,
                achievementDate: this.targetDate,
                targetAmount: this.targetAmount
            })
        } catch (err) {
            throw new ApiError(500, "Failed to create goal")
        }
    }
    getDeadlineTime() {
        const now = new Date();
        const target = new Date(this.targetDate);

        const yearDiff = target.getFullYear() - now.getFullYear();
        const monthDiff = target.getMonth() - now.getMonth();

        const totalMonths = yearDiff * 12 + monthDiff;
        return totalMonths
    }
    autoDeductAmount(userId) {
        const deadline = this.getDeadlineTime
        const deductAmt = this.targetAmount / deadline.totalMonths
        crone.schedule('0 0 * * *', async () => {
            try {
                const today = new Date()
                const currentDay = today.getDate()
                const autoDeductionGoals = await Goal.find({ autoDeduction: true })
                for (const goal of goals) {
                    if (currentDay === autoDeductionGoals.deductionDay) {
                        const lastMonth = autoDeductionGoals.lastDeduction?.getMonth()
                        const thisMonth = today.getMonth()
                        if (lastMonth === thisMonth) continue;
                        if (autoDeductionGoals.totalDeductions >= this.getDeadlineTime) {
                            continue;
                        }

                        const user = await Users.findById(userId)
                        const income = user.income * 0.25
                        if (user.netIncome <= income) {
                            autoDeductionGoals.status = "Paused"
                            await goal.save()
                            return "Goal Paused"
                        }

                        autoDeductionGoals.status = "InProgress"
                        autoDeductionGoals.currentAmt += deductAmt
                        user.income -= deductAmt
                        autoDeductionGoals.lastDeduction = new Date()
                        autoDeductionGoals.totalDeductions += 1

                        const nextDate = new Date()
                        nextDate.setMonth(nextDate.getMonth() + 1)
                        nextDate.setDate(goal.deductionDay)

                        if (nextDate.getDate() !== autoDeductionGoals.deductionDay) {
                            nextDate.setDate(0)
                        }
                        autoDeductionGoals.deductionDay = nextDate;

                        const updatedGoal = await goal.save();
                        const updatedUser = await goal.save()
                        return { updatedGoal, updatedUser }

                    }
                }
            } catch (err) {
                throw new ApiError(500, err.message)
            }
        })



    }
    async manualDeduction(amount, id) {
        try {
            const deadline = this.getDeadlineTime
            const goal = await Goal.findById(id)
            const lastMonth = goal.lastDeduction?.getMonth()
            const thisMonth = today.getMonth()
            if (lastMonth === thisMonth) continue;

            if (goal.totalDeductions >= this.getDeadlineTime) {
                continue;
            }
            const remainingAmount = this.targetAmount - goal.currentAmt
            const deductAmount = remainingAmount / this.deadline
            const AllGoal = await Goal.find({ autoDeduction: false })
            for (goals of goal) { // check all goal whether they are 
                if (goals.targetAmount === 0 && this.getDeadlineTime === 0) {
                    goals.status = "UnAchieved"
                    await goal.save()
                }
            }
            if (!amount || amount > 0) {
                throw new ApiError(400, "Enter a valid amount")
            }
            const user = await Users.findById(userId)
            const income = user.income * 0.25
            if (user.netIncome <= income) {
                goal.status = "Paused"
                await goal.save()
                throw new ApiError(400, "Cant contribute to goal. Less income left")
            }
            goal.status = "InProgress"
            goal.targetAmount -= deductAmount
            goal.currentAmt += deductAmount
            goal.lastDeduction = new Date()
            goal.totalDeductions += 1
            user.income -= deductAmount
            const updatedGoal = await goal.save()
            const updatedUser = await user.save()
            return { updatedGoal, updatedUser }
        } catch (err) {
            throw new ApiError(500, err.message)
        }



    }

    async editGoal(goalID) {
        if (!goalID) {
            throw new ApiError(400, "No goal id found")
        }
        this.validiateGoal()
        const updatedGoal = await Goal.findByIdAndUpdate(
            goalId,
            {
                goalName: this.name,
                achievmentDate: this.targetDate,
                targetAmount: this.targetAmount,
            },
            { new: true }
        )
        return updatedGoal
    }

}

