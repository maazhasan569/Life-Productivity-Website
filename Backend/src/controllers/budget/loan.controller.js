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
const getLoanById = asyncHandler(async (req, res) => {
    const { loanId } = req.params
    const userId = req.user._id
    const getLoan = await Loan.findOne({ _id : loanId, userId })
    res.status(200)
        .json(
            new ApiResponse(200, getGoal ? "Loan fetched" : "Loan not found by Id", getGoal)
        )

})
const getAllLoans = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType, } = req.query
    const userId = req.user._id
    const options = {
        page,
        limit,
        sortBy,
        sortType,
        userId
    }

    const loansData = await paginate(Loan, options)
    if (!loansData.fetchedDoc.length) {
        throw new ApiError(404, "Loans not found")
    }
    return res.status(200)
        .json(
            new ApiResponse(200, "fetched All Loans", loansData)
        )
})
const getLoansByCategory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType, category } = req.query
    const userId = req.user._id
    const options = {
        page,
        limit,
        sortBy: sortBy ,
        sortType: sortType,
        category,
        userId
    }

    const loansData = await paginate(Loan, options)
    if (!loansData.fetchedDoc.length) {
        throw new ApiError(404, "Loans not found")
    }
    return res.status(200)
        .json(
            new ApiResponse(200, "fetched user Loan by category", loansData)
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
    const autoDeductLoamAmt = await loan.autoDeductAmt()

    return res.status(200)
    .json(
        new ApiResponse(200 , "auto duducted loan amt" , autoDeductLoamAmt)
    )
})

const manualDeduction = asyncHandler(async(req,res)=> {
    const userId = req.user._id

    const loan = new LoanService(userId)
    const manualDeductLoanAmt = await loan.manualDeduction()

    return res.status(200)
    .json(
        new ApiResponse(200 , "loan amt deducted(manually)" , manualDeductLoanAmt)
    )
})

const deleteLoan = asyncHandler(async(req,res)=> {
    const userId = req.user._id
    const {loanId} = req.params
    const {deletionReason} = req.body

    const loan = new LoanService(userId)
    const deleteLoan = await loan.deleteLoan(loanId , deletionReason)

    res.status(200)
    .json(
        new ApiResponse(200 , "loan successfully deleted" , deleteLoan)
    )
})