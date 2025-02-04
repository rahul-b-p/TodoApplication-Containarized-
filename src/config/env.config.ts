import { config } from "dotenv";
import { errorMessage } from "../constant";

config();



const requiredEnvVariables: string[] = [
    'MONGODB_URI'
];


requiredEnvVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
        const { ENV_ACKNOWLEDGE, REQUIRED_ENV_MISSING } = errorMessage;
        const envMissingError = new Error();
        envMissingError.message = ENV_ACKNOWLEDGE;
        envMissingError.stack = envVar;
        envMissingError.name = REQUIRED_ENV_MISSING
        throw envMissingError;
    }
});

export const MONGODB_URI = process.env.MONGODB_URI as string;