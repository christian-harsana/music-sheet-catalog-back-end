import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

export const validationMiddleware = (schema: ZodType) => {

    return (req: Request, res: Response, next: NextFunction) => {

        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
                user: req.user
            });

            next();
        }
        
        catch(error: unknown) {

            if (error instanceof ZodError) {

                const userErrors = error.issues.filter(issue => issue.path[0] === 'user');
                let errorHttpCode = userErrors.length > 0 ? 401 : 400;
                let errorMessage = userErrors.length > 0 ? 'Authentication required or invalid user' : 'Validation error';

                return res.status(errorHttpCode).json({
                    success: false,
                    message: errorMessage,
                    errors: error.issues.map(issue => ({
                        path: issue.path.join('.'),
                        message: issue.message
                    }))
                });
            }

            next(error);
        }

    }
}