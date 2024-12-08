import { Hono } from 'hono';
import { getMenuItem, createMenuItem, deleteMenuItem, updateMenuItem } from '../controllers/menucontrollers.js';

const menurouter = new Hono<{
    Bindings: {
      DATABASE_URL:string 
    }
  }>();

// Route for creating a new menu item
menurouter.get('/',getMenuItem);
menurouter.post('/', createMenuItem);
menurouter.delete('/:id',deleteMenuItem);
menurouter.put('/:id',updateMenuItem);


export default menurouter;