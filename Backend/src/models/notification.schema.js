import mongoose from "mongoose"
import { Schema } from "mongoose"

const notificationSchema = new Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    type: {
        type: String,
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
})

export const Notification = mongoose.model("Notification", notificationSchema);
