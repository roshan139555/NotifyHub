import {kafka} from "./kafka.js"

const createKafkaTopics = async() =>{
    if(process.env.KAFKA_ENABLED !== "true"){
        return
    }

    const admin = kafka.admin()

    try {
        await admin.connect()

        await admin.createTopics({
            waitForLeaders:true,
            topics:[
                {
                    topic:"post-liked",
                    numPartitions:3,
                    replicationFactor:1,
                },
                {
                    topic:"post-commented",
                    numPartitions:3,
                    replicationFactor:1,
                },
            ],
        })

        console.log("Kafka Topics Ready")
        await admin.disconnect()
    } catch (error) {
        console.log("Kafka Topic Setup Error:", error.message)
        try {
            await admin.disconnect()
        } catch (disconnectError) {}
    }
}

export {createKafkaTopics}
