import { Router } from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', authorize('ADMIN', 'INTERNAL'), createProduct);
router.put('/:id', authorize('ADMIN', 'INTERNAL'), updateProduct);
router.delete('/:id', authorize('ADMIN'), deleteProduct);

export default router;
