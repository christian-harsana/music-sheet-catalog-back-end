import { rateLimit } from 'express-rate-limit';

export const authRouteLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 5, // each IP can make up to 5 requests per `windowsMs` (1 minute)
    message: 'Too many attempts, please try again later',
    standardHeaders: true, // add the `RateLimit-*` headers to the response
    legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});