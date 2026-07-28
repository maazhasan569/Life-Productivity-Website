import connectDb from "./db/index.js";
import app from "./app.js";


dotenv.config({
    path : "./.env"
})

const port = process.env.PORT || 8000
connectDb()
.then(() => {
    app.on("error" , (err) => {
        console.log(`After server connection established Db crashed , Err :${err}`)
    })
    app.listen(port , () => {
        console.log(`App runnig on port ${port}`)
    })
})