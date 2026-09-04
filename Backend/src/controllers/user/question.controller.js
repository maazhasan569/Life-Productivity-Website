import { Users } from "../../models/users.models.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const questions = asyncHandler(async (req, res) => {
    const { identity, currency, income, budget , bankBalance  } = req.body
    const fieldCheck = [identity, currency, income, budget , bankBalance].some((fields) => {
        if (fields == null || fields === "") return true;
    
    // Only call .trim() if it's actually a string
    if (typeof fields === "string") {
        return fields.trim() === "";
    }

    return false;
    })
    if(fieldCheck){
        throw new ApiError(400 , "all fields are required")
    }
    
    if(!(bankBalance > 0) || bankBalance < income ){
        throw new ApiError(400 , "Invalid bankbalance")
    }
    if (budget > income) {
        throw new ApiError(400, "Budget must be below monthly income")
    }
    console.log(req.user)

    const saveCredentials = await Users.findByIdAndUpdate(
        req.user._id,
        {
            identity,
            currency,
            income,
            netIncome : income - budget,
            budget

        },
        { new: true }
    )
    if (!saveCredentials) {
        throw new ApiError(500, "failed to save credentials")
    }
    return res.status(200)
        .json(
            new ApiResponse(200, `saved usercredentials`, saveCredentials)
        )

})