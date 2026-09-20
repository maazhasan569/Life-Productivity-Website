import { Router } from "express";
import { verfiyJWTAccessToken } from "../../middlewares/verifyJWT.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyDiskFile } from "../../middlewares/verifyDiskFile.js";
import { deleteTask, editTask } from "../controllers/task.controller.js";


const router = Router()

router.route("/create-task").post(
    verfiyJWTAccessToken,
    upload.single("document"),
    verifyDiskFile,
    createTask
)

router.route("/:taskId").put(
    verfiyJWTAccessToken,
    upload.single("document"),
    verifyDiskFile,
    editTask
)

router.route("/:taskId").delete(
    verfiyJWTAccessToken,
    deleteTask
)

router.route("/mark-complete/:taskId").post(
    verfiyJWTAccessToken,
    markTaskComplete
)

router.route("/mark-overdue/:taskId").post(
    verfiyJWTAccessToken,
    markTaskComplete
)