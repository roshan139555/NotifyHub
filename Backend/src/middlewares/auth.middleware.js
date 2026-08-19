import jwt from "jsonwebtoken"
import {User} from "../models/userSchema.js"

const verifyJWT = async(req, res,next) =>{
    try{
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"No Token Provided ."
            });
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user =await User.findById(decodedToken.id).select("-password");

        if(!user){
            return res.status(401).json({
                success: false,
                message:"No User Found"
            });
        }

        req.user = user;
        next();

    }catch(error){
        return res.status(401).json({
            success: false,
            message:"Technical Problem.",
            error: error.message,
        });
    }
}
export {verifyJWT};