import { Users } from "../../models/users.model";
import ApiError from "../../utils/ApiError";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await Users.findById(userId)
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()

        user.refreshToken = refreshToken
        await user.save({ validiateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, error.msg)
    }
}

const options = {
    httpOnly: true,
    secure: true
}
const createUserAccount = asyncHandler((req, res) => {
    const { email, password } = req.body;
    [email, password].some((inpFields) => {
        if (!inpFields || inpFields.trim() === "") {
            throw new ApiError(400, "enter all details")
        }
    })

    const isUserfound = Users.find({
        $or: [{ email }, { password }]
    })

    if (isUserfound) {
        throw new ApiError(400,
            isUserfound.email === email ? "Email already in use"
                : "password already in use"
        )
    }
    if (!isUserfound) {
        throw new ApiError
    }
    const user = await user.create({
        email,
        password,
    })

    if (!user) {
        throw new ApiError(500, "error occured while creating the user")
    }

    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken(user._id)

    return res.status(
        201
    ).cookie(
        "accessToken", accessToken, options
    ).cookie(
        "refreshToken", refreshToken, options
    ).json(
        new ApiResponse(201, "User created", { user, accessToken })
    )

})