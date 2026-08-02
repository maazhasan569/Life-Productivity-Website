import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(
    cors({
        origin : process.env.CORS_ORIGIN,
        credentials : true
    })
)

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// app.js

// ... all your middleware (express.json, cookieParser, etc.)
// ... app.use("/api/v1/auth", authRouter);

// 🚨 Global Error Handler (MUST BE LAST AND HAVE 4 PARAMETERS)
app.use((err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle custom ApiError instances
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});
export default app