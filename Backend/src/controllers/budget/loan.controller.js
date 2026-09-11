import { Loan } from "../../models/budget/loan.models.js";
import { LoanService } from "../../service/loan.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import { paginate } from "../../utils/pagination.js";

const createLoan = asyncHandler(async (req, res) => {

    const {
        name,
        loanTargetAmt,
        duration,
        loanType,
        autoDeduction,
        category
    } = req.body

    console.log(req.body)
    const userId = req.user._id

    const loan = new LoanService(userId, {
        name,
        loanTargetAmt,
        duration,
        loanType,
        autoDeduction,
        category
    })

    const newLoan = await loan.createLoan()

    return res.status(200)
        .json(
            new ApiResponse(200, "loan created", newLoan)
        )
})
const getLoanById = asyncHandler(async (req, res) => {
    const { loanId } = req.params
    const userId = req.user._id
    const getLoan = await Loan.findOne({ _id: loanId, userId })
    res.status(200)
        .json(
            new ApiResponse(200, getLoan ? "Loan fetched" : "Loan not found by Id", getGoal)
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
        sortBy: sortBy,
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
const editLoan = asyncHandler(async (req, res) => {

    const {
        name,
        loanTargetAmt,
        duration,
        loanType,
        autoDeduction,
        category
    } = req.body
    const userId = req.user._id
    const { loanId } = req.params
    const loan = new LoanService(userId, {
        name,
        loanTargetAmt,
        duration,
        loanType,
        autoDeduction,
        category
    })

    const updatedLoan = await loan.editLoan(loanId)

    return res.status(200)
        .json(
            new ApiResponse(200, "Loan updated", updatedLoan)
        )
})

const loansAmtPaid = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const loan = new LoanService(userId)
    const amtPaid = await loan.amtPaid()

    return res.status(200)
        .json(
            new ApiResponse(200, "fetched loan amt paid", amtPaid)
        )
})

const loansAmtRemaining = asyncHandler(async (req, res) => {

    const userId = req.user._id

    const loan = new LoanService(userId)
    const amtRemaining = await loan.amtRemaining()

    return res.status(200)
        .json(
            new ApiResponse(200, "fetched loan amt due on user", amtRemaining)
        )
})

const autoDeduction = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const loan = new LoanService(userId)
    const autoDeductLoamAmt = await loan.autoDeductAmt()

    return res.status(200)
        .json(
            new ApiResponse(200, "auto duducted loan amt", autoDeductLoamAmt)
        )
})

const manualDeduction = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const loan = new LoanService(userId)
    const manualDeductLoanAmt = await loan.manualDeduction()

    return res.status(200)
        .json(
            new ApiResponse(200, "loan amt deducted(manually)", manualDeductLoanAmt)
        )
})

const deleteLoan = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { loanId } = req.params
    const { deletionReason } = req.body

    const loan = new LoanService(userId)
    const deleteLoan = await loan.deleteLoan(loanId, deletionReason)

    res.status(200)
        .json(
            new ApiResponse(200, "loan successfully deleted", deleteLoan)
        )
})

export {
    createLoan,
    getLoanById,
    getAllLoans,
    getLoansByCategory,
    editLoan,
    loansAmtPaid,
    loansAmtRemaining,
    autoDeduction,
    manualDeduction,
    deleteLoan
}