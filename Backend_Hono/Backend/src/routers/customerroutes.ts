import { Hono } from "hono";
const customerrouter= new Hono()


import { getCustomers, createCustomer } from "../controllers/customercontrollers.js";

customerrouter.get('/',getCustomers);
customerrouter.post('/',createCustomer);

export default customerrouter;