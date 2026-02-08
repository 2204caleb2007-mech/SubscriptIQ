import { Router } from 'express';
import { getTaxes, getTax, createTax, updateTax, deleteTax } from '../controllers/tax.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getTaxes);
router.get('/:id', getTax);
router.post('/', authorize('ADMIN'), createTax);
router.put('/:id', authorize('ADMIN'), updateTax);
router.delete('/:id', authorize('ADMIN'), deleteTax);

export default router;
