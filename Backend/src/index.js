import dotenv from "dotenv";
import app from "./app.js"
import connectDb from "./db/dbConection.js";
import {connectProducer} from "./kafka/producer.js"
import {startConsumer} from "./kafka/consumer.js"
import {createKafkaTopics} from "./kafka/admin.js"

dotenv.config({ path: "./.env" });

connectDb()
    .then(async() => {
        await createKafkaTopics();
        await connectProducer();
        await startConsumer();

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port ${process.env.PORT || 8000}`);
        });
    })
    .catch((error) => {
        console.log("MONGODB connection failed !!!", error);
        process.exit(1);
    });
