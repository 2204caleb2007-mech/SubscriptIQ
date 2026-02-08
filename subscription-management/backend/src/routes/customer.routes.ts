import { Router } from 'express';
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customer.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN', 'INTERNAL'), getCustomers);
router.get('/:id', getCustomer);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', authorize('ADMIN'), deleteCustomer);

export default router;
