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
                for (const goal of autoDeductionGoals) {
                    if (currentDay === goal.deductionDay) {
                        const lastMonth = goal.lastDeduction?.getMonth()
                        const thisMonth = today.getMonth()
                        if (lastMonth === thisMonth) continue;
                        if (goal.totalDeduction >= this.getDeadlineTime) {
                            goals.targetAmount === 0 ?
                                goal.status = "UnAchieved" : goal.status = "Achieved"
                            await goal.save()

                        }
                    }

                    const user = await Users.findById(userId)
                    const income = user.income * 0.25
                    if (user.netIncome <= income) {
                        autoDeductionGoals.status = "Paused"
                        await goal.save()
                    }
                    goal.status = "InProgress"
                    goal.currentAmt += deductAmt
                    user.netIncome -= deductAmt
                    goal.lastDeduction = new Date()
                    goal.totalDeductions += 1
                    const orgDate = new Date(goal.createdAt).getDate()
                    const currentDay = new Date()
                    const targetMonth = currentDay.getMonth() + 1
                    const targetYear = currentDay.getFullYear()

                    if (targetMonth > 11) {
                        targetMonth = 0
                        targetYear += 1
                    }
                    const getTargetDate = new Date(targetYear, targetMonth + 1, 0).getDate();
                    const safeDay = Math.min(getTargetDate, orgDate)

                    goal.deductionDay = new Date(targetYear, targetMonth, safeDay)

                    const updatedGoal = await goal.save();
                    const updatedUser = await goal.save()
                    return { updatedGoal, updatedUser }

                }
            }
            } catch (err) {
            throw new ApiError(500, err.message)
        })



    }
    async manualDeduction(amount, goalId) {
        try {
            const deadline = this.getDeadlineTime
            const goal = await Goal.findById(goalId)
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
                return;
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
        try {
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
        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }
    async deleteGoal(goalId, userId) {
        if (goalId) {
            throw new ApiError(400, "No goal id found")
        }
        try {
            //find and update the goal status
            //add goal balance to income
            //delete the goal 
            //add the deleted goal to history

            const updateGoal = await Goal.findByIdAndUpdate(
                goalId,
                {
                    status: "Abondened"
                },
                { new: true }
            )
            if (!updateGoal) {
                throw new ApiError(400, "Goal id not found")
            }
            const user = await Users.findById(this.id)
            user.netIncome -= updateGoal.currentAmt
            const updatedUserIncome = await user.save()
            const deleteGoal = await Goal.findByIdAndDelete(goalId)
            const updateGoalHistory = await History.find({ userId: this.id })

            return { message: {} }


        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }

}

//task : add validition to add minimum of 1month of goal