import { Loan } from "../models/budget/loan.models"
import ApiError from "../utils/ApiError"
import { Users } from "../models/users.models"
import cron from "node-cron"
import { use } from "react"
export class LoanService {
    constructor(userId, config = {}) {
        this.userId = userId,
            this.name = config.name,
            this.loanTargetAmt = config.loanTargetAmt,
            this.targetDate = null,
            this.frequency = config.frequency,
            this.category = config.category,
            this.duration = config.duration,
            this.autoDeduction = config.autoDeduction,
            this.totalPaid = 0
    }

    validateLoan() {
        const fieldCheck = [this.name, this.loanTargetAmt, this.frequency, this.duration]
            .some((field) => {
                if (typeof field === 'string') {
                    return !field || field.trim() === ""
                }
                if (!field) return !field
            })
        if (fieldCheck) {
            throw new ApiError(400, "Enter All fields")
        }

        if (this.loanTargetAmt < 0) {
            throw new ApiError(400, "Enter a Valid amt")
        }
    }

    async createLoan() {
        this.setTargetDate(this.duration, this.frequency)
        this.validateLoan()
        try {
            const newLoan = await Loan.create({
                userId: this.userId,
                loanName: this.name,
                loanAmt: this.loanTargetAmt,
                currentAmt: this.totalPaid,
                dueDate: this.targetDate,
                loanType: this.frequency,
                autoDeduction: this.autoDeduction,
                category: this.category,
                status: "Inprogress"
            })
            const updateUserBankbalance = await Users.findByIdAndUpdate(
                this.userId,
                { $inc: { bankBalance: this.loanTargetAmt } },
                { new: true }
            )
            return { newLoan, updateUserBankbalance }
        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }

    setTargetDate(duration, frequency) {
        const date = new Date()
        if (frequency === "Yearly") {
            this.duration = duration * 12
        }
        date.setMonth(date.getMonth() + this.duration)
        date.setHours(0, 0, 0, 0)
        this.targetDate = date
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
    async editLoan(loanId) {
        try {
            if (!loanId) {
                throw new ApiError(400, "No goal if found")
            }
            this.setTargetDate(duration, frequency)
            this.validateLoan()
            const updateLoan = await Loan.findByIdAndUpdate(
                goalId,
                {
                    userId: this.userId,
                    loanName: this.name,
                    loanTargetAmt: this.loanTargetAmt,
                    currentAmt: this.totalPaid,
                    dueDate: this.targetDate,
                    loanType: this.frequency,
                    autoDeduction: this.autoDeduction,
                    category: this.category
                },
                { new: true }
            )
            return updateLoan
        } catch (err) {
            throw new ApiError(400, err.message)
        }
    }
    async AmtPaid() {
        try {
            const userLoans = await Loan.find({ userId: this.userId })
            if (!userLoans) return 0
            const totalPaid = userLoans.reduce((sum, loan) => sum + loan.currentAmt, 0)
            return totalPaid
        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }
    async AmtRemaining() {
        try {
            const userLoans = await Loan.find({ userId: this.userId })
            if (!userLoans) return 0
            const loansAmtRemaining = userLoans.reduce((sum, loan) => sum + loan.loanTargetAmt, 0)
            return loansAmtRemaining
        } catch (err) {
            throw new ApiError(500, err.msg)
        }
    }
    async autoDeductAmt() {
        try {
            cron.schedule('0 0 * * * ', async () => {
                const today = new Date()
                const autoDeductionLoans = await Loan.find({
                    autoDeduction: true,
                    userId: this.userId,
                    status: "Inprogress"
                })

                for (const loan of autoDeductionLoans) {
                    this.loanTargetAmt = loan.loanTargetAmt
                    this.totalPaid = loan.currentAmt
                    this.duration = loan.duration
                    this.autoDeductAmt = loan.autoDeduction
                    this.frequency = loan.type
                    this.category = loan.category
                    this.name = loan.name

                    if (today.getDate() === loan.deductionDay.getDate()) {
                        const lastMonth = loan.lastDeduction?.getMonth()
                        const thisMonth = today.getMonth()
                        if (lastMonth === thisMonth) continue;

                        if (loan.totalDeductions === this.duration) {
                            this.targetAmount !== 0 ?
                                loan.status = "Overdue" : loan.status = "Completed"
                            await loan.save()
                            continue;
                        }

                        const user = await Users.findByIdAndUpdate(this.userId)
                        const income = user.income * 0.25
                        if (user.netIncome <= income) {
                            loan.status = "Paused"
                            await loan.save()
                            continue;
                        }

                        const deadlineInMonths = this.getDeadlineTime(this.duration, this.frequency)
                        const deductAmt = (this.loanTargetAmt - this.totalPaid) / deadlineInMonths
                        this.totalPaid += deductAmt
                        this.loanTargetAmt -= deductAmt

                        loan.currentAmt = this.totalPaid
                        loan.loanTargetAmt = this.loanTargetAmt
                        user.netIncome -= deductAmt
                        loan.lastDeduction = new Date()
                        loan.totalDeductions += 1

                        const orgDate = new Date(loan.createdAt).getDate()
                        const currentDay = new Date()
                        let targetMonth = currentDay.getMonth() + 1
                        let targetYear = currentDay.getFullYear()
                        const daysInNextMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
                        const safeDay = Math.min(daysInNextMonth, orgDate)
                        loan.deductionDay = new Date(targetYear, targetMonth, safeDay)

                        const updatedLoan = await loan.save()
                        const updatedUser = await user.save()

                        return { updatedLoan, updatedUser }


                    }
                }
            })
        } catch (err) {
            throw new ApiError(400, err.message)
        }
    }

    async manualDeduction(){

    }

    async alert(){

    }
    async deleteLoan(){
        
    }
}