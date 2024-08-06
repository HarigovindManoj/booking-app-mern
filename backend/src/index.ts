import express,{Request,Response} from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import userRoutes from './routes/users'
import authRoutes from './routes/auth'
import cookieParser from "cookie-parser"
import path from 'path'


mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
     

const app = express();
app.use(cookieParser());
app.use(express.json()) //It helps to convert the body of api requests into json automatically for us
app.use(express.urlencoded({extended:true})) // helps to parse the url to get/create parameters etc 
app.use(
    cors({
          origin:process.env.FRONTEND_URL,
          credentials:true,
        })
) // helps us from non-blocking of urls

app.use(express.static(path.join(__dirname,"../../frontend/dist")))

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)

app.listen(7000,()=>{
    console.log("Server running on localhost:7000")
})