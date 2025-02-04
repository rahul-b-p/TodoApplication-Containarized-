import morgan from "morgan";
import { logger } from "../utils";



const stream = { write: (message: any) => logger.info(message.trim()) }
export const morganLogger = morgan("dev", { stream });