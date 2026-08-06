import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { Document } from "../models/document.models";
import { Users } from "../models/users.models";
import fileUpload from "../utils/fileUpload";
import ApiResponse from "../utils/ApiResponse";

const uploadFile = asyncHandler(async (req, res) => {
    const { type } = req.body
    const filePath = req.filePath
    const user = req.user
    //check if the user is authenticated
    //not type then throw err
    //if type doc then save in doc schema
    //then save in user avatar
    //run the fileupload func
    const fileUrl = await fileUpload(filePath)
    if (!type) {
        throw new ApiError(400, "No file type found (doc/avatar)")
    }
    const response = type.toLowerCase() === "document" ?
        await Document.create({
            document: fileUrl
        }) : Users.findByIdAndUpdate(
            user._id,
            {
                avatar: fileUrl
            }
        )

    if (!response) {
        throw new ApiError(500, "failed to save file to db")
    }

    return res.status(201)
        .json(
            new ApiResponse(201, `New ${type} file created`, { [type]: fileUrl })
        )
})