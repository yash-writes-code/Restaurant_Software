import { PrismaClient } from '@prisma/client';
import { Context } from 'hono';

const prisma = new PrismaClient();

// Get all categories
export async function getCategories(c: Context): Promise<Response> {
  try {
    const categories = await prisma.category.findMany(); // Fetches all categories
    return c.json(categories, 200); // Sends back the categories as JSON with 200 status
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ error: 'An error occurred while fetching categories.' }, 500);
  }
}

// Add new category
export async function createCategory(c: Context): Promise<Response> {
  const body = await c.req.json(); // Extract request body
  const { name } = body;

  if (!name) {
    return c.json({ error: 'Category name is required.' }, 400);
  }

  try {
    // Create a new category
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });
    return c.json(newCategory, 201); // Return the newly created category
  } catch (error) {
    console.error('Error creating category:', error);
    return c.json({ error: 'An error occurred while creating the category.' }, 500);
  }
}
