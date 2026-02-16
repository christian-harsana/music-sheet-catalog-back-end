import express, { Express } from 'express';
import { corsMiddleware } from './middleware/cors.middleware';
import { morganMiddleware } from './middleware/morgan.middleware';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware';
import routes from './routes/index';
import helmet from 'helmet';

const app: Express = express();

// For request logging
app.use(morganMiddleware);

// To avoid giving information of the Back-end
app.disable('x-powered-by');

// Enable CORS - NOTE: Put BEFORE routes
app.use(corsMiddleware);

// Helmet - For setting security-related HTTP headers
app.use(helmet());

// This is required to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandlerMiddleware);

export default app;