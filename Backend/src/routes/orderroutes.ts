import { Router } from 'express';
const router = Router();

import {createOrder,updateOrder,deleteOrder} from "../controllers/ordercontrollers.js"

router.post('/',createOrder);
router.put('/:orderId',updateOrder);
router.delete('/:orderId',deleteOrder);

export default router;