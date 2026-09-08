import { Loan } from "../models/budget/loan.models"
import ApiError from "../utils/ApiError"
import { Users } from "../models/users.models"
import cron from "node-cron"
import { isValidObjectId } from "mongoose"
import pushToHistory from "../utils/pushToHistory"
import { convertToSnakeCase } from "../utils/convertToSnakeCase"
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
                duration: this.duration,
                loanType: this.frequency,
                autoDeduction: this.autoDeduction,
                category: this.category,
                status: "in_progress"
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

            if(!isValidObjectId(loanId)){
                throw new ApiError(400 , "id not valid")
            }
            this.setTargetDate(duration, frequency)
            this.validateLoan()
            const updateLoan = await Loan.findByIdAndUpdate(
                goalId,
                {
                    userId: this.userId,
                    loanName: this.name,
                    loanTargetAmt: this.loanTargetAmt,
                    duration: this.duration,
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
    async amtPaid() {
        try {
            const userLoans = await Loan.find({ userId: this.userId })
            if (!userLoans) return 0
            const totalPaid = userLoans.reduce((sum, loan) => sum + loan.currentAmt, 0)
            return totalPaid
        } catch (err) {
            throw new ApiError(500, err.message)
        }
    }
    async amtRemaining() {
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
                    status: "in_progress"
                })

                for (const loan of autoDeductionLoans) {
                    
                    this.loanTargetAmt = loan.loanTargetAmt
                    this.totalPaid = loan.currentAmt
                    this.duration = loan.duration
                    this.autoDeductAmt = loan.autoDeduction
                    this.frequency = loan.type
                    this.category = loan.category
                    this.name = loan.name

                    const lastdeductionidx = loan.deductionDates.length - 1
                    if (today.getDate() === loan.deductionDay.getDate()) {
                        const lastMonth = loan.deductionDates[lastdeductionidx]?.getMonth()
                        const thisMonth = today.getMonth()
                        if (lastMonth === thisMonth) continue;

                        if (loan.totalDeductions === this.duration) {
                            const status = this.loanTargetAmt !== 0 ?
                                "Overdue" : "Completed"

                            loan.status = status
                            await loan.save()
                            if (status === "Completed") {
                                const deleteLoan = await Loan.findByIdAndDelete(loan._id)
                                await pushToHistory(this.userId, deleteLoan._id, "loans")
                            }
                            continue;
                        }

                        const user = await Users.findByIdAndUpdate(this.userId)
                        const income = user.income * 0.25
                        if (user.netIncome <= income) {
                            loan.status = "no_funds"
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
                        loan.deductionDates.append(new Date)
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
    async manualDeduction(amount, loanId) {
        if (!loanId) {
            throw new ApiError(400, "loan id is required")
        }
        if (!isValidObjectId(loanId)) {
            throw new ApiError(400, "Invalid loanid")
        }

        try{
            const loan = await Loan.findOne({
            _id: loanId,
            userId: this.userId,
            autoDeduction: false,
            status: "in_progress"
        })

        this.loanTargetAmt = loan.loanTargetAmt
        this.totalPaid = loan.currentAmt
        this.duration = loan.duration
        this.autoDeduction = loan.autoDeduction
        this.frequency = loan.type
        this.category = loan.category
        this.name = loan.name

        const lastDeductionIdx = loan.deductionDates.length - 1
        let deadlineInMonths = this.getDeadlineTime(this.duration, this.frequency)
        const lastMonth = loan.deductionDates[lastDeductionIdx]?.getMonth()
        const thisMonth = new Date().getMonth()
        if (lastMonth === thisMonth) throw new ApiError(400, "Loan monthly amt already paid")

        if (!amount || amount < 0) {
            throw new ApiError(400, "Enter a valid amount")
        }

        if (amount > this.loanTargetAmt) {
            throw new ApiError(400, "Amount cant be more than targetAmt")
        }

        const user = await Users.findById(this.userId)
        if (amount > user.netIncome) {
            throw new ApiError(400, "Amount to large . netIncome not enough")
        }

        const income = user.income * 0.25
        if (user.netIncome <= income) {
            loan.status = "no_funds"
            const saveloan = await loan.save()
            return saveloan
        }


        this.totalPaid += amount
        this.loanTargetAmt -= amount

        loan.loanTargetAmt = this.loanTargetAmt
        loan.currentAmt = this.totalPaid
        loan.deductionDates.append(new Date())
        loan.totalDeductions += 1
        user.netIncome -= amount

        if (this.loanTargetAmt === 0 && deadlineInMonths !== 0) {
            deadlineInMonths = 0
        }

        if (loan.totalDeductions + 1 > deadlineInMonths || loan.totalDeductions + 1 === this.duration) {
            const status = this.loanTargetAmt !== 0 ?
                "Overdue" : "Completed";

            loan.status = status
            const updatedLoan = await loan.save()
            const updatedUser = await user.save()
            let deleteLoan;
            if (status === "Completed") {
                deleteLoan = await Loan.findByIdAndDelete(loan._id)
                await pushToHistory(this.userId, deleteLoan._id, "loans")
                return { updatedLoan, updatedUser, pushedToHistory: true }
            }

            return { updatedLoan, updatedUser, pushedToHistory: false }
        }

        const updatedLoan = await loan.save()
        const updatedUser = await user.save()
        return { updatedLoan, updatedUser, pushedToHistory: false }
        }catch(err){
            throw new ApiError(500 , err.message)
        }

    }

    async pauseLoan(loanId , undoAlertOrUnBlockLoan = false) {
         //get the lastdeduction array
         //loop over each element
         //check if there a time of the month where user hasnot paid for 3 or more months
         //if yes set consecutive = true
         //if not give a normal alert 
         //also return no. of consecutive miss deduction

         let consecutive = false
         let totalMissedDeductions;

         const loan = await Loan.findById(loanId)

         if(undoAlertOrUnBlockLoan){
         if(loan.status === "Paused") loan.status = "in_progress"
            return
         }
         
         const dates = loan.deductionDates
         loan.deductionDates.forEach((elem , idx) => {
            const prevDeduction = dates[idx].getMonth()
            const nextDeduction = dates[idx + 1].getMonth()
            const monthsDiff = nextDeduction - prevDeduction
            
           if(monthsDiff >= 3){
            loan.status = "Paused"
            totalMissedDeductions = monthsDiff
            consecutive = true

           }else if (monthsDiff > 1 && monthsDiff < 3){
            loan.status = "Paused"
            totalMissedDeductions = monthsDiff
            consecutive = false

           }
         })

         await loan.save()

         return {totalMissedDeductions , consecutive}
         
         //alert feature will be added in the next version 1.1
         //loan model will have seperate alert field containing an alert msg of the loan

         
    }
    async deleteLoan(loanId, deletionReason) {

        if (!loanId) {
            throw new ApiError(400, "No loan id found")
        }

        try {
            if (!isValidObjectId(loanId)) {
                throw new ApiError(400, "Invalid mongoose objId")
            }

            const userReason = convertToSnakeCase(deletionReason)
            const validReasons = [
                "created_by_mistake",
                "no_longer_needed",
                "found_alternative",
                "personal_reason",
                "other"
            ]

            if (!validReasons.includes(userReason)) {
                throw new ApiError(400, "Invalid loan deletion reason")
            }

            const loan = await Loan.findById(loanId)
            if (!loan) {
                throw new ApiError(400, "Loan not found")
            }
            const updatedUserBankBalance = await Users.findByIdAndUpdate(
                this.userId,
                {
                    $inc: { bankBalance: loan.currentAmt }
                }
            )
            const deletedLoan = await Loan.findByIdAndDelete(loanId)
            const history = await pushToHistory(this.userId, deletedLoan._id, "loans")
            return { history, deletedLoan, updatedUserBankBalance }
        } catch (err) {
            throw new ApiError(400, err.message)
        }
    }
}