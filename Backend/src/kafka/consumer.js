import { kafka } from "./kafka.js"
import { Notification } from "../models/notification.schema.js"

const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID || "notifyhub-notification-group",
})

const startConsumer = async () => {
    const kafkaEnabled = process.env.KAFKA_ENABLED === "true"

    if(!kafkaEnabled){
        console.log("Kafka Consumer Disabled")
        return
    }

    try {
        await consumer.connect()
        console.log("Kafka Consumer Connected")

        await consumer.subscribe({
            topics: ["post-liked", "post-commented", "user-followed"],
            fromBeginning: false,
        })

        await consumer.run({
            eachMessage: async ({ topic, message }) => {
                try {
                    const data = JSON.parse(message.value.toString())
                    console.log("Kafka Event Received:", topic, data)

                    if (topic === "post-liked" || topic === "post-commented") {
                        if (data.postOwnerId.toString() === data.userId.toString()) {
                            return
                        }
                    }

                    if (topic === "post-liked") {
                        await Notification.create({
                            recipient: data.postOwnerId,
                            sender: data.userId,
                            type: "like",
                            post: data.postId,
                            message: "liked your post.",
                        })
                    }

                    if (topic === "post-commented") {
                        await Notification.create({
                            recipient: data.postOwnerId,
                            sender: data.userId,
                            type: "comment",
                            post: data.postId,
                            comment: data.commentId,
                            message: "commented on your post.",
                        })
                    }

                    if (topic === "user-followed") {
                        await Notification.create({
                            recipient: data.targetUserId,
                            sender: data.userId,
                            type: "follow",
                            message: "started following you.",
                        })
                    }
                } catch (error) {
                    console.log("Kafka Consumer Error:", error.message)
                }
            },
        })
    } catch (error) {
        console.log("Kafka Consumer Connection Failed:", error.message)
    }
}

export { startConsumer }
