import prisma from '../../config/prisma';
//import prisma from '../../config/prisma.js';
import { Context } from 'hono';

const { customer } = prisma;

// GET all customers
export async function getCustomers(c: Context): Promise<Response> {
  try {
    console.log('Trying to find all customers');
    const customers = await customer.findMany(); // Fetch customers
    console.log('customers--------------> ', customers);

    return c.json(customers, 200); // Return customers as JSON
  } catch (error) {
    console.error('Error fetching customers:', error);
    return c.json({ error: 'Error fetching customers' }, 500);
  }
}

// Create a new customer
export async function createCustomer(c: Context): Promise<Response> {
  try {
    const body = await c.req.json(); // Extract request body
    const { name, phone } = body;

    if (!name || !phone) {
      return c.json({ error: 'Name and phone are required.' }, 400);
    }

    const newCustomer = await customer.create({
      data: {
        name: name,
        phone: phone,
      },
    });
    return c.json(newCustomer, 201); // Return the newly created customer
  } catch (error) {
    console.log('An error occurred while creating customer:', error);
    return c.json({ error: 'An error occurred while creating customer' }, 500);
  }
}
