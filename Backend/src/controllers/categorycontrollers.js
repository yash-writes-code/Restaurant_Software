const prisma = require("../config/prisma");


async function getCategories(req, res){
    try {
      const categories = await prisma.category.findMany(); // Fetches all categories
      res.status(200).json(categories); // Sends back the categories as JSON
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'An error occurred while fetching categories.' });
    }
  };
  
  //ADD NEW CATEGORIES
async function createCategory (req, res){
    const { name } = req.body; // Extract category name from request body
  
    if (!name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }
  
    try {
      // Create a new category
      const newCategory = await prisma.category.create({
        data: {
          name,
        },
      });
      res.status(201).json(newCategory); // Return the newly created category
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'An error occurred while creating the category.' });
    }
  };
  
module.exports ={
    getCategories,
    createCategory
}