const prisma = require("../config/prisma");

async function createMenuItem(req, res) {
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
    return res
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
          create: priceOptions.map((option) => ({
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

async function deleteMenuItem(req, res) {
  const { id } = req.params;

  // Input validation
  if (!id) {
    return res.status(400).json({ error: "Menu item ID is required." });
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

async function updateMenuItem(req, res) {
  const { id } = req.params;
  const { itemName, available, categoryId, priceOptions } = req.body;

  // Input validation
  if (!id || !itemName || !categoryId || !Array.isArray(priceOptions)) {
    return res
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
      data: priceOptions.map((option) => ({
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

async function getMenuItem(req, res){
    const { query } = req.query; // Get the search query from the frontend
    try {
      const menuItems = await prisma.menuItem.findMany({
        where: {
          itemName: {
            contains: query,
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

  
module.exports = {
    getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
