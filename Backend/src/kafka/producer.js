import { kafka } from "./kafka.js"

const producer = kafka.producer()
let producerConnected = false
const connectProducer = async () => {
    const kafkaEnabled = process.env.KAFKA_ENABLED === "true"

    if(!kafkaEnabled){
        console.log("Kafka Producer Disabled")
        return
    }

    try {
        await producer.connect()
        producerConnected = true
        console.log("Kafka Producer Connected")
    } catch (error) {
        producerConnected = false
        console.log("Kafka Producer Connection Failed:", error.message)
    }
}

const sendMessage = async (topic, message) => {
    const kafkaEnabled = process.env.KAFKA_ENABLED === "true"

    if(!kafkaEnabled){
        return false
    }

    try {
        if (!producerConnected) {
            return false
        }

        await producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(message),
                },
            ],
        })

        console.log("Kafka Event Sent:", topic)
        return true
    } catch (error) {
        console.log("Kafka Producer Error:", error.message)
        return false
    }
}

export { connectProducer, sendMessage }
