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
    deductAmount() {
        const deadline = this.getDeadlineTime
        const deductAmt = this.targetAmount / deadline.totalMonths
        crone.schedule('0 0 * * *', async () => {
            try {
                const today = new Date()
                const currentDay = today.getDate()
                const autoDeductionGoals = await Goal.find({ autoDeduction: true })
                for (const goal of goals) {
                    if (currentDay === autoDeductionGoals.deductionDay) {
                        const lastMonth = goal.lastDeduction?.getMonth()
                        const thisMonth = today.getMonth()
                        if (lastMonth === thisMonth) continue;
                        if (goal.deductionsCompleted >= goal.goalDurationMonths) {
                            continue;
                        }
                        autoDeductionGoals.targetAmount -= deductAmt
                        autoDeductionGoals.lastDeduction = new Date()
                        autoDeductionGoals.totalDeductions += 1

                        const nextDate = new Date()
                        nextDate.setMonth(nextDate.getMonth() + 1)
                        nextDate.setDate(goal.deductionDay)

                        if (nextDate.getDate() !== autoDeductionGoals.deductionDay) {
                            nextDate.setDate(0)
                        }
                        autoDeductionGoals.deductionDay = nextDate;

                        await goal.save();
                    }
                }
            }
        })



    }
    deadLineAlert() {

    }

}

