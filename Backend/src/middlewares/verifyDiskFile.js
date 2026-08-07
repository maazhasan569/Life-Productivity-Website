import { fileTypeFromFile } from "file-type";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import fs from "fs"
export const verifyDiskFile = asyncHandler(async (req, res, next) => {

    if (!req.file) {
        throw new ApiError(404, "No file given")
    }
    try {

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
        const detectedType = await fileTypeFromFile(req.file.path)

        if (!detectedType || !allowedTypes.includes(detectedType.mime)) {
            fs.unlinkSync(req.file.path)
            throw new ApiError(400, "Invalid file type")
        }
        req.file.realMimeType = detectedType.mime;
        req.file.realExtension = detectedType.ext;
        req.filePath = req.file.path

        next()
    } catch (err) {
        throw new ApiError(500, err.msg)
    }
})