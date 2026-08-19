import { User } from "../models/userSchema.js"
import { sendMessage } from "../kafka/producer.js"

const toggleFollow = async(req,res) => {
    try {
        const targetUser = await User.findById(req.params.id)

        if(!targetUser){
            return res.status(404).json({
                success:false,
                message:"User Not Found.",
            })
        }

        if(targetUser._id.toString() === req.user._id.toString()){
            return res.status(400).json({
                success:false,
                message:"You cannot follow yourself.",
            })
        }

        const currentUser = await User.findById(req.user._id)

        const alreadyFollowing = currentUser.following.some(
            (id) => id.toString() === targetUser._id.toString()
        )

        if(alreadyFollowing){
            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== targetUser._id.toString()
            )

            targetUser.followers = targetUser.followers.filter(
                (id) => id.toString() !== currentUser._id.toString()
            )

            await currentUser.save()
            await targetUser.save()

            return res.status(200).json({
                success:true,
                message:"User Unfollowed Successfully.",
            })
        }

        currentUser.following.push(targetUser._id)
        targetUser.followers.push(currentUser._id)

        await currentUser.save()
        await targetUser.save()

        await sendMessage("user-followed", {
            userId: currentUser._id,
            targetUserId: targetUser._id,
        })

        return res.status(200).json({
            success:true,
            message:"User Followed Successfully.",
        })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:"Technical Problem.",
            error:error.message,
        })
    }
}

const getUserProfile = async(req,res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("fullname username avatar followers following createdAt")

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User Not Found.",
            })
        }

        return res.status(200).json({
            success:true,
            message:"User Profile Fetched Successfully.",
            data:user,
        })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:"Technical Problem.",
            error:error.message,
        })
    }
}

export {toggleFollow,getUserProfile}
