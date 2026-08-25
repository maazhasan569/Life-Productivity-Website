import { Goal } from "../../models/budget/goals.models";
import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/asyncHandler";
import { paginate } from "../../utils/pagination";

const getGoalById = asyncHandler(async (req, res) => {
    const { goalId } = req.params
    const getGoal = await Goal.findById(goalId)
    res.status(200)
        .json(
            new ApiResponse(200, getGoal ? "Goal fetched" : "Goal not found by Id", getGoal ? getGoal : {})
        )

})
const getAllGoals = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType, } = req.query
    const userId = req.user._id
    const options = {
        page,
        limit,
        sortBy,
        sortType,
        userId
    }

    const goalsData = await paginate(Goal, options)
    return res.status(200)
        .json(
            new ApiResponse(200, goalsData ? "fetched user goals" : "No goals found", goalsData ? goalsData : [])
        )
})
const getGoalsByCategory = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy, sortType, category } = req.query
    const userId = req.user._id
    const options = {
        page,
        limit,
        sortBy: sortBy || "createdAt",
        sortType: sortType || "asc",
        category,
        userId
    }

    const goalsData = await paginate(Goal, options)
    return res.status(200)
        .json(
            new ApiResponse(200, goalsData ? "fetched user goals" : "No goals found", goalsData ? goalsData : [])
        )

})