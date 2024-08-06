import mongoose from "mongoose";
import bcrypt from "bcryptjs"

export type UserType = {
    _id:string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
};

const userSchema = new mongoose.Schema({
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    firstName: {type:String, required: true},
    lastName: {type:String, required:true}
});

userSchema.pre("save",async function (next){ //Define a pre-save middleware function that runs before saving a user document.
    if(this.isModified('password')){ //If the password field has been modified, hash the password using bcrypt.hash with a salt rounds value of 8.
        this.password = await bcrypt.hash(this.password,8) //Call next() to proceed to the next middleware or save the document.
    }
    next();
})

const User = mongoose.model<UserType>("User",userSchema)

export default User
