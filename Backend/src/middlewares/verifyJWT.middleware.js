import { Users } from "../models/users.model";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

export const verfiyJWTAccessToken = asyncHandler(async(req,res,next) => {
    try{
        const accessToken = req.cookie.accessToken || req.header("Authorization")
    .replace("Bearer " , "")
    
    if(!accessToken){
        throw new ApiError(401 , "Unauthorized req - token not found")
    }
    const decodedToken = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET)
    const isUser = await Users.findById(decodedToken._id)
    if(!isUser){
        throw new ApiError(401 , "invalid accesstoken")
    }
    req.user = isUser
    next()
    }catch(err){
        throw new ApiError(401 , err.msg)
    }
})