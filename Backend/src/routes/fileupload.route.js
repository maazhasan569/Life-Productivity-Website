import { Router } from "express";
import { verfiyJWTAccessToken } from "../middlewares/verifyJWT.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyDiskFile } from "../middlewares/verifyDiskFile.js";
import { uploadFile, updateFile, deleteFile } from "../controllers/fileUpload.controller.js";

const router = Router()

router.route("/upload-file").post(
    verfiyJWTAccessToken,
    upload.single("File"),
    verifyDiskFile,
    uploadFile
)
router.route("/update-file/:id").put(
    verfiyJWTAccessToken,
    upload.single("File"),
    verifyDiskFile,
    updateFile
)
router.route("/delete-file/:id").delete(
    verfiyJWTAccessToken,
    deleteFile
)
export default router