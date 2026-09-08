import { Router } from "express";
import { verfiyJWTAccessToken } from "../../middlewares/verifyJWT.middleware";
import {
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
} from "../../controllers/budget/loan.controller";
import { verify } from "jsonwebtoken";

const router = Router()

router.route("/create-loan").post(verfiyJWTAccessToken,createLoan)
router.route("/").get(verfiyJWTAccessToken, getAllLoans)
router.route("/category").get(verfiyJWTAccessToken, getLoansByCategory)
router.route("/amt-paid").get(verfiyJWTAccessToken, loansAmtPaid)
router.route("/amt-remaining").get(verfiyJWTAccessToken, loansAmtRemaining)
router.route("auto-deduct").post(verfiyJWTAccessToken, autoDeduction)
router.route("/manual-deduct").post(verfiyJWTAccessToken, manualDeduction)

router.route("/loanId").delete(verfiyJWTAccessToken, deleteLoan)
router.route("/:loanId").put(verfiyJWTAccessToken, editLoan)
router.route("/:loanId").get(verfiyJWTAccessToken, getLoanById)

