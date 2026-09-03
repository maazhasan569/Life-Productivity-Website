import { Loan } from "../models/budget/loan.models"
import ApiError from "../utils/ApiError"

export class LoanService {
    constructor(userId , config = {}) {
        this.userId = userId,
        this.name = config.name,
        this.loanTargetAmt = config.loanTargetAmt,
        this.targetDate = null,
        this.frequency = config.frequency,
        this.category = config.category,
        this.duration = config.duration,
        this.autoDeduction = config.autoDeduction
        this.totalPaid = 0 ,

    }

    validateLoan(){
        const fieldCheck = [this.name , this.loanTargetAmt , this.frequency,this.duration]
        .some((field) => {
            if(typeof field === 'string'){
                return !field || field.trim()  === ""
            }
            return !field
        })

        if(fieldCheck){
            throw new ApiError(400 , "Enter All fields")
        }
    }

    async createLoan(){
        this.validateLoan()
        try{
            const newLoan = await Loan.create({
                userId : this.userId,
                loanName : this.name,
                loanAmt : this.loanTargetAmt,
                currentAmt : this.totalPaid,
                dueDate : this.targetDate,
                loanType : this.frequency,
                autoDeduction : this.autoDeduction,
                category : this.category

            }) 
        }catch(err){
            throw new ApiError(500 , err.message)
        }
    }
}