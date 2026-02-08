import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
<<<<<<< HEAD
        name: string;
=======
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
        role: string;
    };
}

export type AsyncHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => Promise<any>;
