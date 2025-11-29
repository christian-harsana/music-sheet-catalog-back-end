import express, { Express, Request, Response } from 'express';
import { corsMiddleware } from './middleware/cors.middleware';
import routes from './routes/index';

const app: Express = express();

// Enable CORS - NOTE: Put BEFORE routes
app.use(corsMiddleware);

// This is required to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api', routes);

export default app;