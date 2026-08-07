import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Document } from "../models/document.models.js";
import { Users } from "../models/users.models.js";
import fileUpload from "../utils/fileUpload.js";
import ApiResponse from "../utils/ApiResponse.js";
import { v2 as cloudinary } from "cloudinary"

export const uploadFile = asyncHandler(async (req, res) => {
    const { type } = req.body
    const filePath = req.filePath
    const user = req.user
    //check if the user is authenticated
    //not type then throw err
    //if type doc then save in doc schema
    //then save in user avatar
    //run the fileupload func
    const { fileUrl, publicId } = await fileUpload(filePath)
    if (!type) {
        throw new ApiError(400, "No file type found (doc/avatar)")
    }
    const response = type.toLowerCase() === "document" ?
        await Document.create({
            document: fileUrl,
            publicId,
        }) : Users.findByIdAndUpdate(
            user._id,
            {
                avatar: fileUrl,
                publicId,
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

const updateFile = asyncHandler(async (req, res) => {
    //find the file by id
    //if file run
    //if 
    const { id } = req.params
    const filePath = req.filePath
    const existingFile = await Document.findById(id)
    if (!existingFile) {
        throw new ApiError(404, "File not found")
    }

    await deleteFromCloudinary(existingFile.cloudinaryPublicId)
    const { fileUrl, publicId } = await fileUpload(filePath)
    if (!type) {
        throw new ApiError(400, "No file type found (doc/avatar)")
    }
    const response = type.toLowerCase() === "document" ?
        await Document.findByIdAndUpdate(
            existingFile._id,
            {
                document: fileUrl,
                publicId,
            },
            { new: true }) : Users.findByIdAndUpdate(
                user._id,
                {
                    avatar: fileUrl,
                    publicId,
                },
                { new: true }
            )

    if (!response) {
        throw new ApiError(500, "failed to save file to db")
    }
    return res.status(200)
        .json(
            new ApiResponse(201, ` ${type} updated`, { [type]: fileUrl })
        )


})

const deleteFile = asyncHandler(async (req, res) => {
    //find the file by id
    //if file run
    //if 
    const { id } = req.params
    const filePath = req.filePath
    const existingFile = await Document.findById(id)
    if (!existingFile) {
        throw new ApiError(404, "File not found")
    }

    await deleteFromCloudinary(existingFile.cloudinaryPublicId)
    const { fileUrl, publicId } = await fileUpload(filePath)
    if (!type) {
        throw new ApiError(400, "No file type found (doc/avatar)")
    }
    const response = type.toLowerCase() === "document" ?
        await Document.findByIdAndDelete(
            existingFile._id,
            {
                document: fileUrl,
                publicId,
            },
            { new: true }) : Users.findByIdAndUpdate(
                user._id,
                {
                    avatar: fileUrl,
                    publicId,
                },
                { new: true }
            )

    if (!response) {
        throw new ApiError(500, "failed to save file to db")
    }
    return res.status(200)
        .json(
            new ApiResponse(201, ` ${type} deleted`, { [type]: fileUrl })
        )


})
