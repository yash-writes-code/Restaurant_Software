import { Hono } from "hono";

const orderrouter = new Hono();

import {createOrder,updateOrder,deleteOrder} from "../controllers/ordercontrollers.js"

orderrouter.post('/',createOrder);
orderrouter.put('/:orderId',updateOrder);
orderrouter.delete('/:orderId',deleteOrder);

export default orderrouter;