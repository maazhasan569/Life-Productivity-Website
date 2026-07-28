import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
import ApiError from "../utils/ApiError.js"

const connectDb = async () => {
    try {
        if(!process.env.DB_URL){
            throw new ApiError(500 , "Db url not defined" )
        }
        const connectionInstance = await mongoose.connect(
            `${process.env.DB_URL}/${DB_NAME}`
        )
        console.log(`MongoDB connection established ${connectionInstance.connection.host}`)
    }catch(err){
        console.log(`MongoDB connection failed! ${err}`)
        process.exit(1)
    }

}
export default connectDb