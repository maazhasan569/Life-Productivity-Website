import { Router } from "express";
import { verfiyJWTAccessToken } from "../middlewares/verifyJWT.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyDiskFile } from "../middlewares/verifyDiskFile.js";
import { deleteTask, editTask, createTask, markTaskComplete, markTaskOverDue } from "../controllers/task.controller.js";


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

router.route("/tasks/:taskId/mark-complete").post(
    verfiyJWTAccessToken,
    markTaskComplete
)

router.route("/tasks/:taskId/mark-overdue").post(
    verfiyJWTAccessToken,
    markTaskOverDue
)
export default router