import mongoose from "mongoose"
import { User } from "../models/userSchema.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



const registerUser = async(req,res) =>{
    try{
    
        const{fullname,username,password,email} = req.body;

        if(!fullname || !username|| !password|| !email){
            return res.status(400).json({
                success: false,
                message : "All Fields Are Required .",
            });
        }
        const existedUser = await User.findOne({
            $or: [{email}, {username}],
        });

        if(existedUser){
            return res.status(409).json({
                success: false,
                message: "User Already Exist .",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await User.create({
            fullname, email, username, password: hashedPassword,
        });
        const createdUser = await User.findOne(user._id).select("-password");
        
        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
        });

       
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Technical User.",
            error: error.message,
        });
    }
};

const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success:false,
                message: "Login Credentials are Required."
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"No User Exist"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                success: false,
                message:"Password is Incorrect"
            });
        }
        const accessToken = jwt.sign({
            id: user._id,
        },process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });

        const loggedInUser = await User.findOne(user._id).select("-password");
        return res.status(200).json({
            success:true,
            message:"User Signed In ",
            accessToken,
            data:loggedInUser,
        });

    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Technical Error",
            error:err.message,
        });
    }
}

const getCurrentUser = async(req, res)=>{
    return res.status(200).json({
        success: true,
        message: "User Fetched Successfully",
        data: req.user,
    });
}

export{
    registerUser,loginUser,getCurrentUser
}