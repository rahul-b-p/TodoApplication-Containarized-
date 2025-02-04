import mongoose from "mongoose";
import { MONGODB_URI } from "../config";
import { logger } from "../utils"



export const connectMongoDB = async (): Promise<void> => {
    try {

        const mongoConnect = await mongoose.connect(MONGODB_URI);
        logger.info(`Mongo DB Connected: ${mongoConnect.connection.host}`);

        mongoose.connection.on('disconnected', () => {
            logger.info('MongoDB disconnected');
        });

        mongoose.connection.on('error', (err) => {
            logger.info('MongoDB connection error:', err);
        });

    } catch (error: any) {
        logger.error(`DB Connection Failed: ${error.message}`);
        throw new Error(error.message);
    }
}