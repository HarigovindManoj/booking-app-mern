import  express,{Request,Response}  from "express";
import User from "../models/user";
import jwt from "jsonwebtoken"
import { check,validationResult } from "express-validator"

const router  = express.Router();

 // /api/users/register
router.post("/register",[
     check("firstName","First Name is required").isString(),
     check("lastName","Last Name is required").isString(),
     check("email","Email is required").isEmail(),
     check("password","Password with 6 or more characters required").isLength({min:6})
],
    async (req:Request,res: Response)=>{
         const errors = validationResult(req);
         if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()});
         }
    try {
        // Check if the user already exists in the database
        let user = await User.findOne({
            email:req.body.email
        })      

         if(user){
            return res.status(400).json({message: "User already exists"})
         }
         // Create a new user with the data from the request body
         user = new User(req.body);

           // Save the new user to the database
         await user.save();

         // Create a JWT token for the new user
         const token =jwt.sign(
            {userId:user.id}, // Payload containing the user's ID
            process.env.JWT_SECRET_KEY as string, // Secret key for signing the token
            {
               expiresIn:"1d"
            }
        );
        // Set the token as a cookie in the response
        res.cookie("auth_token",token,{
            httpOnly:true, // Make the cookie accessible only by the web server
            secure:process.env.Node_env === "production", // Use secure cookies in production
             maxAge:86400000 // Cookie expiration time (1 day in milliseconds)
        })
        return res.status(200).send({message:"User registered OK"})

    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Something went wrong"});

    }
});

export default router


