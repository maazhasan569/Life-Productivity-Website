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
        new ApiResponse(200 , "loan created" , newLoan)
    )
})

const editLoan = asyncHandler(async(res,res) => {

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
    
    const userId = req.user._id
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

    const updatedLoan = loan.editLoan()

    return res.status(200)
    .json(
        new ApiResponse(200 , "Loan updated")
    )
})

const loansAmtPaid = asyncHandler(async(req,res)=> {

    const userId = req.user._id

    const loan = new LoanService(userId)
    const amtPaid = await loan.amtPaid()

    return res.status(200)
    .json(
        new ApiResponse(200 , "fetched loan amt paid" , amtPaid)
    )
})

const loansAmtRemaining = asyncHandler(async(req,res)=> {

    const userId = req.user._id

    const loan = new LoanService(userId)
    const amtRemaining = await loan.amtRemaining()

    return res.status(200)
    .json(
        new ApiResponse(200 , "fetched loan amt due on user" , amtRemaining)
    )
})

const autoDeduction = asyncHandler(async(req,res)=> {
    const userId = req.user._id

    const loan = new LoanService(userId)
    const autoDeductLoamAmt = loan.autoDeductAmt()

    return res.status(200)
    .json(
        new ApiResponse(200 , "auto duducted loan amt" , autoDeductLoamAmt)
    )
})

const manualDeduction = asyncHandler(async(req,res)=> {
    const userId = req.user._id

    const loan = new LoanService(userId)
    const manualDeductLoanAmt = loan.manualDeduction()

    return res.status(200)
    .json(
        new ApiResponse(200 , "loan amt deducted(manually)" , manualDeductLoanAmt)
    )
})

const 