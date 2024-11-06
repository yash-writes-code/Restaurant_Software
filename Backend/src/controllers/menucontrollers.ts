import { MenuItem } from "@prisma/client";
import prisma from "../config/prisma.js";
import { Request,Response } from "express";



interface priceOption{
    id :    string;  
    size       :string; 
    price      :number;
    menuItem  : MenuItem;
    menuItemId :string;  
}
export async function createMenuItem(req: Request, res: Response) : Promise<void>{
  console.log("Received request to create a menu item");
  const { itemName, categoryId, available, priceOptions } = req.body;
  console.log(req.body);
  // Input validation
  if (
    !itemName ||
    !categoryId ||
    !priceOptions ||
    !Array.isArray(priceOptions)
  ) {
    console.log("yha fas gya");
     res
      .status(400)
      .json({
        error: "Item name, category, and valid price options are required.",
      });
  }

  try {
    // Create the new menu item with price options
    const newMenuItem = await prisma.menuItem.create({
      data: {
        itemName,
        available,
        categoryId, // Associate the menu item with the category by categoryId
        priceOptions: {
          create: priceOptions.map((option:priceOption) => ({
            size: option.size,
            price: option.price,
          })),
        },
      },
      include: {
        priceOptions: true, // Include price options in the response
      },
    });

    console.log("New menu item created:", newMenuItem);
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the menu item." });
  }
}

export async function deleteMenuItem(req: Request, res: Response) : Promise<void> {
  const { id } = req.params;

  // Input validation
  if (!id) {
     res.status(400).json({ error: "Menu item ID is required." });
  }

  try {
    // First, delete the associated price options
    await prisma.priceOption.deleteMany({
      where: {
        menuItemId: id, // Assuming price options have a foreign key to menu items
      },
    });

    // Then, delete the menu item itself
    const deletedMenuItem = await prisma.menuItem.delete({
      where: {
        id: id,
      },
    });

    console.log("Deleted menu item:", deletedMenuItem);
    res.status(200).json({ message: "Menu item deleted successfully." });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the menu item." });
  }
}

export async function updateMenuItem(req: Request, res: Response) : Promise<void>{
  const { id } = req.params;
  const { itemName, available, categoryId, priceOptions } = req.body;

  // Input validation
  if (!id || !itemName || !categoryId || !Array.isArray(priceOptions)) {
     res
      .status(400)
      .json({
        error:
          "Menu item ID, item name, category ID, and valid price options are required.",
      });
  }

  try {
    // Update the menu item
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        itemName,
        available,
        categoryId,
      },
    });

    // Update price options
    // First, delete existing price options for this menu item
    await prisma.priceOption.deleteMany({
      where: { menuItemId: id },
    });

    // Then, create new price options
    const updatedPriceOptions = await prisma.priceOption.createMany({
      data: priceOptions.map((option:priceOption) => ({
        size: option.size,
        price: option.price,
        menuItemId: id, // Associate with the updated menu item
      })),
    });

    console.log("Updated menu item:", updatedMenuItem);
    console.log("Updated price options:", updatedPriceOptions);

    res
      .status(200)
      .json({ message: "Menu item updated successfully.", updatedMenuItem });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the menu item." });
  }
}

export async function getMenuItem(req: Request, res: Response) : Promise<void>{
    const query = req.query.query as string|undefined; // Get the search query from the frontend
    try {
      const menuItems = await prisma.menuItem.findMany({
        where: {
          itemName: {
            contains: query || "",
            mode: 'insensitive'
          },
        },
        include: {
          priceOptions: true, // Ensure price options are included
        }
      });
  
      res.status(200).json(menuItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ error: 'An error occurred while fetching menu items.' });
    }
  };

  
