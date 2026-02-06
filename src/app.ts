import express, { Express, Request, Response } from 'express';
import { corsMiddleware } from './middleware/cors.middleware';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware';
import routes from './routes/index';
import helmet from 'helmet';

const app: Express = express();

// To avoid giving information of the Back-end
app.disable("x-powered-by");

// Helmet - For setting security-related HTTP headers
app.use(helmet());

// Enable CORS - NOTE: Put BEFORE routes
app.use(corsMiddleware);

// This is required to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandlerMiddleware);

export default app;