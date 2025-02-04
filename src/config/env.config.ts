import { config } from "dotenv";
import { errorMessage } from "../constant";

config();



const requiredEnvVariables: string[] = [
    'MONGODB_URI',
    'HASH_SALT_ROUNDS',
    'ADMIN_USERNAME',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD'
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

export const HASH_SALT_ROUNDS = process.env.HASH_SALT_ROUNDS as string;

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME as string;
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;