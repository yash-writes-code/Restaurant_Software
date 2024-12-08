import { Hono } from "hono";

const orderrouter = new Hono<{
    Bindings: {
      DATABASE_URL:string 
    }
  }>();

import {createOrder,updateOrder,deleteOrder} from "../controllers/ordercontrollers.js"

orderrouter.post('/',createOrder);
orderrouter.put('/:orderId',updateOrder);
orderrouter.delete('/:orderId',deleteOrder);

export default orderrouter;