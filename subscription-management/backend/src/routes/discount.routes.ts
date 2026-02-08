import { Router } from 'express';
import {
    getDiscounts,
    getDiscount,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    validateDiscount,
} from '../controllers/discount.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getDiscounts);
router.get('/:id', getDiscount);
router.post('/', authorize('ADMIN', 'INTERNAL'), createDiscount);
router.put('/:id', authorize('ADMIN', 'INTERNAL'), updateDiscount);
router.delete('/:id', authorize('ADMIN'), deleteDiscount);
router.post('/validate', validateDiscount);

export default router;
