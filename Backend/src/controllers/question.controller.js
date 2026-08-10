import { Users } from "../models/users.models";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const questions = asyncHandler(async (req, res) => {
     
    const { identity, currency, income, budget, yearly } = req.body

    [identity, currency, income, budget].some((fields) => {
        if (!fields) {
            throw new ApiError(400, "fill all the fields")
        }
    })
    const monthlyIncome = yearly? income/12 : income
    if(budget > monthlyIncome){
        throw new ApiError(400 , "Budget must be below monthly income")
    }
    
    const saveCredentials = await User.findByIdAndUpdate(
        req.user._id,
        {
            identity,
            currency,
            income,
            budget

        },
        {new : true}
    )
    if(!saveCredentials){
        throw new ApiError(500 , "failed to save credentials")
    }
    return res.status(200)
    .json(
        new ApiResponse(200 , `saved usercredentials` , saveCredentials)
    )
    
})