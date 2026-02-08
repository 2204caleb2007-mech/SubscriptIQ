import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Auth Header:', authHeader); // DEBUG

        const token = authHeader?.replace('Bearer ', '');
        console.log('Token extracted:', token ? token.substring(0, 10) + '...' : 'None'); // DEBUG

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            email: string;
<<<<<<< HEAD
            name: string;
=======
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
            role: string;
        };

        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Verify Error:', error); // DEBUG
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        next();
    };
};
