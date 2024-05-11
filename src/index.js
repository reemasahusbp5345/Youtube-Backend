import dotenv from "dotenv"
import ConnectDB from "./db/index.js";
import app from "./app.js";
 
dotenv.config({
    path: './.env'
})
const PORT=process.env.PORT || 8000;
ConnectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running at port ${PORT}`)
    })
}).catch((err)=>{
    console.log("App connection failed",err)
});