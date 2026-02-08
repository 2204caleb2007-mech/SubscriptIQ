import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}

export type AsyncHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => Promise<any>;
