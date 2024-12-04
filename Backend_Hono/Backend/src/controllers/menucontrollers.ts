import prisma from '../../config/prisma';
import { Context } from 'hono';

// Define the priceOption interface
interface priceOption {
  id: string;
  size: string;
  price: number;
  menuItemId: string;
}

// Create a new menu item
export async function createMenuItem(c: Context): Promise<Response> {
  console.log('Received request to create a menu item');
  const body = await c.req.json();
  const { itemName, categoryId, available, priceOptions } = body;

  // Input validation
  if (
    !itemName ||
    !categoryId ||
    !priceOptions ||
    !Array.isArray(priceOptions)
  ) {
    return c.json(
      {
        error: 'Item name, category, and valid price options are required.',
      },
      400
    );
  }

  try {
    const newMenuItem = await prisma.menuItem.create({
      data: {
        itemName,
        available,
        categoryId,
        priceOptions: {
          create: priceOptions.map((option: priceOption) => ({
            size: option.size,
            price: option.price,
          })),
        },
      },
      include: { priceOptions: true },
    });

    console.log('New menu item created:', newMenuItem);
    return c.json(newMenuItem, 201);
  } catch (error) {
    console.error('Error creating menu item:', error);
    return c.json({ error: 'An error occurred while creating the menu item.' }, 500);
  }
}

// Delete a menu item
export async function deleteMenuItem(c: Context): Promise<Response> {
  const { id } = c.req.param();

  if (!id) {
    return c.json({ error: 'Menu item ID is required.' }, 400);
  }

  try {
    await prisma.priceOption.deleteMany({
      where: { menuItemId: id },
    });

    const deletedMenuItem = await prisma.menuItem.delete({
      where: { id },
    });

    console.log('Deleted menu item:', deletedMenuItem);
    return c.json({ message: 'Menu item deleted successfully.' }, 200);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return c.json({ error: 'An error occurred while deleting the menu item.' }, 500);
  }
}

// Update a menu item
export async function updateMenuItem(c: Context): Promise<Response> {
  const { id } = c.req.param();
  const body = await c.req.json();
  const { itemName, available, categoryId, priceOptions } = body;

  if (!id || !itemName || !categoryId || !Array.isArray(priceOptions)) {
    return c.json(
      {
        error:
          'Menu item ID, item name, category ID, and valid price options are required.',
      },
      400
    );
  }

  try {
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        itemName,
        available,
        categoryId,
      },
    });

    await prisma.priceOption.deleteMany({ where: { menuItemId: id } });

    await prisma.priceOption.createMany({
      data: priceOptions.map((option: priceOption) => ({
        size: option.size,
        price: option.price,
        menuItemId: id,
      })),
    });

    console.log('Updated menu item:', updatedMenuItem);
    return c.json({ message: 'Menu item updated successfully.', updatedMenuItem }, 200);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return c.json({ error: 'An error occurred while updating the menu item.' }, 500);
  }
}

// Get menu items
export async function getMenuItem(c: Context): Promise<Response> {
  const query = c.req.query('query') || '';

  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        itemName: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: { priceOptions: true },
    });

    return c.json(menuItems, 200);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return c.json({ error: 'An error occurred while fetching menu items.' }, 500);
  }
}
