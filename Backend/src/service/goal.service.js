
import { Expense } from "../models/budget/expense.models";
import { Goal } from "../models/budget/goals.models";
import { Users } from "../models/users.models";
import ApiError from "../utils/ApiError";
import cron from "node-cron"
export class Goal {
    constructor(userId, config = {}) {
        this.userId = this.userId;
        this.name = config.name || null;
        this.targetAmount = config.targetAmount || null;
        this.targetDate = config.targetDate || null;
        this.frequency = config.frequency || 'Monthly'; // or 'yearly'
        this.category = config.category || null;
        this.duration = config.duration
        this.autoDeduction = config.autoDeduction
        this.goalBalance = goalBalance
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
                targetAmount: this.targetAmount,
                status: "InProgress",
                type: this.frequency,
                duration,
                autoDeduction: this.autoDeduction,

            })
        } catch (err) {
            throw new ApiError(500, "Failed to create goal")
        }
    }
    setTargetDate(duration, frequency) {
        const date = new Date()
        if (frequency === "Yearly") {
            this.duration = duration * 12
        }
        date.setMonth(date.getMonth() + this.duration)
        this.targetDate = date.setHours(0, 0, 0, 0)
    }
    getDeadlineTime(duration, frequency) {
        const now = new Date();
        this.setTargetDate(duration, frequency)
        const target = new Date(this.targetDate);

        const yearDiff = target.getFullYear() - now.getFullYear();
        const monthDiff = target.getMonth() - now.getMonth();

        const totalMonths = yearDiff * 12 + monthDiff;
        return totalMonths
    }
    autoDeductAmount(userId) {



        try {
            cron.schedule('0 0 * * *', async () => {
                const today = new Date().getDate()
                const autoDeductionGoals = await Goal.find({ autoDeduction: true })
                for (const goal of autoDeductionGoals) {
                    this.targetAmount = goal.targetAmount
                    this.goalBalance = goal.currentAmt
                    this.duration = goal.duration
                    this.autoDeduction = goal.autoDeduction
                    this.frequency = goal.type
                    this.category = goal.category
                    this.name = goal.name

                    if (today.getDate() === goal.deductionDay.getDate()) {
                        const lastMonth = goal.lastDeduction?.getMonth()
                        const thisMonth = today.getMonth()
                        if (lastMonth === thisMonth) continue;
                        if (goal.totalDeduction >= this.duration) {
                            this.targetAmount !== 0 ?
                                goal.status = "UnAchieved" : goal.status = "Achieved"
                            await goal.save()

                        }

                        const user = await Users.findById(userId)
                        const income = user.income * 0.25
                        if (user.netIncome <= income) {
                            goal.status = "Paused"
                            await goal.save()
                            continue;
                        }


                        const deadlineInMonths = this.getDeadlineTime(this.duration, this.frequency)
                        const deductAmt = this.targetAmount - this.goalBalance / deadlineInMonths
                        this.goalBalance += deductAmt
                        this.targetAmount -= this.goalBalance

                        goal.status = "InProgress"
                        goal.currentAmt = this.goalBalance
                        goal.targetAmount = this.targetAmount
                        user.netIncome -= deductAmt
                        goal.lastDeduction = new Date()
                        goal.totalDeductions += 1
                        const orgDate = new Date(goal.createdAt).getDate()
                        const currentDay = new Date()
                        let targetMonth = currentDay.getMonth() + 1
                        let targetYear = currentDay.getFullYear()

                        if (targetMonth > 11) {
                            targetMonth = 0
                            targetYear += 1
                        }
                        const getTargetDate = new Date(targetYear, targetMonth + 1, 0).getDate();
                        const safeDay = Math.min(getTargetDate, orgDate)

                        goal.deductionDay = new Date(targetYear, targetMonth, safeDay)

                        const updatedGoal = await goal.save();
                        const updatedUser = await user.save()

                        return { updatedGoal, updatedUser }
                    }
                }
            })
        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }
    async manualDeduction(amount, goalId) {
        try {
            const goal = await Goal.findById(goalId)
            this.targetAmount = goal.targetAmount
            this.goalBalance = goal.currentAmt
            this.duration = goal.duration
            this.autoDeduction = goal.autoDeduction
            this.frequency = goal.type
            this.category = goal.category
            this.name = goal.name
            const deadlineInMonths = this.getDeadlineTime(this.duration, this.frequency)
            const lastMonth = goal.lastDeduction?.getMonth()
            const thisMonth = today.getMonth()
            if (lastMonth === thisMonth) return;
            if (this.targetAmount === 0 && !deadline) {
                deadlineInMonths = 0
            }
            if (goal.totalDeductions >= deadlineInMonths) {
                this.targetAmount == !0 ?
                    goal.status = "UnAchieved" : goal.status = "Achieved"
                await goal.save()
                return;
            }


            if (!amount || amount > 0) {
                throw new ApiError(400, "Enter a valid amount")
            }
            const user = await Users.findById(userId)
            const income = user.income * 0.25
            if (user.netIncome <= income) {
                goals.status = "Paused"
                await goals.save()
                return;
            }
            this.goalBalance += amount
            this.targetAmount -= this.goalBalance
            goal.status = "InProgress"
            goal.targetAmount = this.targetAmount
            goal.currentAmt = this.goalBalance
            goal.lastDeduction = new Date()
            goal.totalDeductions += 1
            user.income -= amount
            const updatedGoal = await goal.save()
            const updatedUser = await user.save()

            return { updatedGoal, updatedUser }
        } catch (err) {
            throw new ApiError(500, err.message)
        }



    }

    async editGoal(goalId) {
        try {
            if (!goalId) {
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
    async deleteGoal(goalId) {
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
            if (!updateGoal) return null

            const user = await Users.findById(this.userId)
            user.netIncome -= updateGoal.currentAmt
            const updatedUserIncome = await user.save()
            const deleteGoal = await Goal.findByIdAndDelete(goalId)
            const updateGoalHistory = await History.find({ userId: this.id })

            return {}


        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }

}



