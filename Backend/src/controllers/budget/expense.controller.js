import ApiError from "../../utils/ApiError"
import asyncHandler from "../../utils/asyncHandler"
import { Users } from "../../models/users.models"
import { Expense } from "../../models/budget/expense.models"
import ApiResponse from "../../utils/ApiResponse"
const fieldCheck = (arr) => {
    arr.some((fields) => {
        return fields === "" || fields.trim() === ""
    })
}

const createExpense = asyncHandler(async (req, res) => {
    //if there is any loan,goal,
    //if there a budget
    //deduct the amt saved for loan and goals from budget
    //in loans and goals section
    //check the spending trends of user->(frontend)

    const { name, amount, category } = req.body
    const check = fieldCheck([name, amount])
    if (check) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await Users.findById(req.user._id)
    const userBudget = user.budget
    if (userBudget === 0) {
        throw new ApiError(400, "no budget amt left")
    }
    if (amount > userBudget) {
        throw new ApiError(400, "Expense amount is to big , greator than budget")
    }
    const createExpense = await Expense.create(
        {
            userId: req.user._id,
            amount,
            category,
        }
    )

    if (!createExpense) {
        throw new ApiError(400, "failed to save expense in database")
    }

    return res.status(200)
        .json(
            new ApiResponse(200, "Expense created", createExpense)
        )

})
