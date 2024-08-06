import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

const router = express.Router();

// POST /api/users/login
router.post(
  "/login",
  [
    // Validation rules
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user exists in the database
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Compare the password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create a JWT token for the authenticated user
      const token = jwt.sign(
        { userId: user.id }, // Payload containing the user's ID
        process.env.JWT_SECRET_KEY as string, // Secret key for signing the token
        {
          expiresIn: "1d", // Token expiration time (1 day)
        }
      );

      // Set the token as a cookie in the response
      res.cookie("auth_token", token, {
        httpOnly: true, // Make the cookie accessible only by the web server
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        maxAge: 86400000, // Cookie expiration time (1 day in milliseconds)
      });

      return res.status(200).json({ userId: user._id }); // Send a 200 OK status and user ID
    } catch (error) {
      // Log the error and send a 500 status with a message
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/validate-token",verifyToken,(req:Request,res:Response)=>{
  res.status(200).send({userId:req.userId})
})

router.post("/logout" , (req:Request,res:Response)=>{
  res.cookie("auth_token","",{
    expires:new Date(0),
  })
  res.send();
})


export default router;
