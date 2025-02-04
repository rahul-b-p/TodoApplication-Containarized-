import express from 'express';
import './config/env.config';
import { logger } from './utils';
import { morganLogger } from './config';


const app = express();
const port = process.env.PORT || 3000;

/**
 * Initializing the express application, and listening at the given port
 */
const InitializeApp = () => {
    try {

        //using morgan logger on application
        app.use(morganLogger);

        // listening the application on port
        app.listen(port,()=>{
            logger.info(`Server running successfully at http://localhost:${port}`);
        });

    } catch (error: any) {
        logger.error('Failed to initialize application:', error);
        process.exit(1);
    }
}

InitializeApp();




// Handle uncaught errors

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});