import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

interface Category {
  id: string;
  name: string;
}

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories: Array<Category> | null = await prisma.category.findMany(); // Fetches all categories
    res.status(200).json(categories); // Sends back the categories as JSON
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'An error occurred while fetching categories.' });
  }
}

// Add new category
export async function createCategory(req: Request, res: Response): Promise<void> {
  const { name } = req.body; // Extract category name from request body

  if (!name) {
    res.status(400).json({ error: 'Category name is required.' });
    return;
  }

  try {
    // Create a new category
    const newCategory: Category = await prisma.category.create({
      data: {
        name,
      },
    });
    res.status(201).json(newCategory); // Return the newly created category
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'An error occurred while creating the category.' });
  }
}

