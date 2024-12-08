import { Hono } from "hono";
const customerrouter= new Hono<{
    Bindings: {
      DATABASE_URL:string 
    }
  }>();


import { getCustomers, createCustomer } from "../controllers/customercontrollers.js";

customerrouter.get('/',getCustomers);
customerrouter.post('/',createCustomer);

export default customerrouter;