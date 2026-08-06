import multer from "multer"
import ApiError from "./ApiError.js"
import sharp from "sharp"
import { inspectPdf } from "../utils/inspectPdf.js"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})
const fileFilter = (req, file, cb) => {
    try {
        if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
            cb(null, true)
        } else {
            cb(new ApiError(400, "A pdf or an imag file is required"), false)
        }
        const allowedFileExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf']

        const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
        if (!allowedFileExts.includes(ext)) {
            cb(new ApiError(400, "File extension not allowed"), false)
        }

    } catch (err) {
        cb(err.msg, false)
    }
}

export const upload = multer({
    storage,

})