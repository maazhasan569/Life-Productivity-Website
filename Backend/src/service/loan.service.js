import { Loan } from "../models/budget/loan.models"
import ApiError from "../utils/ApiError"

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
                return !field
            })

        if (fieldCheck) {
            throw new ApiError(400, "Enter All fields")
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

            return newLoan
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
}