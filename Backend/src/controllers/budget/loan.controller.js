import { Loan } from "../../models/budget/loan.models";
import { LoanService } from "../../service/loan.service";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";


const createLoan = asyncHandler(async (req, res) => {

    const {
        name,
        loanAmt,
        currentAmt,
        dueDate,
        duration,
        loanType,
        autoDeduction,
        categary 
    } = req.body 

    const userId = req.user_id
    
    const loan = new LoanService(userId , {
        name,
        loanAmt,
        currentAmt,
        dueDate,
        duration,
        loanType,
        autoDeduction,
        categary
    })
    
    const newLoan = await loan.createLoan()

    return res.status(200)
    .json(
        new ApiResponse(200 , newLoan , "new loan created")
    )
})