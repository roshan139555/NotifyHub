import { Notification } from "../models/notification.schema.js"

const getNotifications = async(req,res) =>{
    try {
        const notifications = await Notification.find({recipient:req.user._id})
            .populate("sender", "fullname username avatar")
            .populate("post", "content")
            .sort({createdAt:-1})

        return res.status(200).json({
            success:true,
            message:"Notifications Fetched Successfully.",
            data:notifications,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Technical Problem.",
            error:error.message,
        })
    }
}

const markNotificationAsRead = async(req,res) =>{
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id:req.params.id,
                recipient:req.user._id,
            },
            {
                isRead:true,
            },
            {
                new:true,
            }
        )

        if(!notification){
            return res.status(404).json({
                success:false,
                message:"Notification Not Found.",
            })
        }

        return res.status(200).json({
            success:true,
            message:"Notification Marked As Read.",
            data:notification,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Technical Problem.",
            error:error.message,
        })
    }
}

const markAllNotificationsAsRead = async(req,res) =>{
    try {
        await Notification.updateMany(
            {
                recipient:req.user._id,
                isRead:false,
            },
            {
                isRead:true,
            }
        )

        return res.status(200).json({
            success:true,
            message:"All Notifications Marked As Read.",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Technical Problem.",
            error:error.message,
        })
    }
}

export {getNotifications,markNotificationAsRead,markAllNotificationsAsRead}
