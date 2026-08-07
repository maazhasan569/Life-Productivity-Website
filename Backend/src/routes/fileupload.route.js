import { Router } from "express";
import { verfiyJWTAccessToken } from "../middlewares/verifyJWT.middleware";
import { upload } from "../middlewares/multer.middleware";
import { verifyDiskFile } from "../middlewares/verifyDiskFile";
import { uploadFile } from "../controllers/fileUpload.controller";

const router  = Router()

router.route("upload-file").post(
    verfiyJWTAccessToken,
    upload.single("File"),
    verifyDiskFile,
    uploadFile

)