class ApiError extends Error {
    constructor(
        status,
        message = "something went wrong",
        error = [],
        stack = ""
    ) {
        this.status = status,
            super(message),
            this.error = error,
            this.success = false,
            this.data = null

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }

}
export default ApiError