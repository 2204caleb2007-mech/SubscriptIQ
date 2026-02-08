import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Register new user (Public - always CUSTOMER)
export const register = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user - Force role to CUSTOMER
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'CUSTOMER',
            },
        });

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as any }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Create User (Admin only - can set role)
export const createUser = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        // Ensure requester is Admin
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Only admins can create staff/admin accounts' });
        }

        // Validate role
        const validRoles = ['ADMIN', 'INTERNAL', 'CUSTOMER'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'CUSTOMER',
            },
        });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

// Get all users (Admin only)
export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                lastLogin: true,
                createdAt: true,
            },
        });

        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Login user
export const login = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password, role } = req.body;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log('Login failed: User not found', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('Login failed: Password mismatch for', email);
            console.log('Input:', password, 'Hash:', user.password);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check role if provided
        if (role && user.role !== role) {
            return res.status(403).json({ error: 'Access denied for this role' });
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as any }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// Google OAuth login/register
export const googleAuth = async (req: AuthRequest, res: Response) => {
    try {
        const { email, name, avatar, googleId } = req.body;

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Create new user with Google
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: await bcrypt.hash(googleId, 10), // Use Google ID as password
                    role: 'CUSTOMER', // Default role for Google sign-in
                    avatar,
                },
            });
        } else {
            // Update avatar if provided
            if (avatar) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { avatar, lastLogin: new Date() },
                });
            }
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as any }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ error: 'Google authentication failed' });
    }
};

// Get current user
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                company: true,
                status: true,
                lastLogin: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
};

// Update User (Admin only)
export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;

        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const data: any = { name, email, role };
        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: id as string },
            data,
        });

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// Delete User (Admin only)
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Prevent deleting yourself
        if (req.user?.id === id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await prisma.user.delete({ where: { id: id as string } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// Logout (client-side token removal, but we can blacklist if needed)
export const logout = async (req: AuthRequest, res: Response) => {
    res.json({ message: 'Logged out successfully' });
};
