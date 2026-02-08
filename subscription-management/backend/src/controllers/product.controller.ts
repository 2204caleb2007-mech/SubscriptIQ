import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../types';

// Get all products
export const getProducts = async (req: AuthRequest, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            include: { plans: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

// Get single product
export const getProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
<<<<<<< HEAD
            where: { id: id as string },
=======
            where: { id },
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
            include: { plans: true },
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

// Create product
export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, category, price, variants, status } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                category,
                price: parseFloat(price),
                variants: parseInt(variants) || 1,
                status: status || 'active',
            },
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

// Update product
export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, variants, status } = req.body;

        const product = await prisma.product.update({
<<<<<<< HEAD
            where: { id: id as string },
=======
            where: { id },
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(category && { category }),
                ...(price && { price: parseFloat(price) }),
                ...(variants && { variants: parseInt(variants) }),
                ...(status && { status }),
            },
        });

        res.json(product);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// Delete product
export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

<<<<<<< HEAD
        await prisma.product.delete({ where: { id: id as string } });
=======
        await prisma.product.delete({ where: { id } });
>>>>>>> 5f4cac2a1e7b0645f4d5862972bb98d2c7e4d7b0

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
