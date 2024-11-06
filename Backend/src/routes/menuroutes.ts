import { Router } from 'express';
import { getMenuItem, createMenuItem, deleteMenuItem, updateMenuItem } from '../controllers/menucontrollers.js';
const router = Router();

// Route for creating a new menu item
router.get('/',getMenuItem);
router.post('/', createMenuItem);
router.delete('/:id',deleteMenuItem);
router.put('/:id',updateMenuItem);


export default router;