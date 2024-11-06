import { Router } from "express";
const router = Router();

import { getCustomers, createCustomer } from "../controllers/customercontrollers.js";

router.get('/',getCustomers);
router.post('/',createCustomer);

export default router;