const prisma = require("../config/prisma");

// GET all customers
async function getCustomers(req, res) {
  try {
    console.log("tryna find all customers");
    const customers = await prisma.customer.findMany(); // Fetch customers
    console.log("customers--------------> ", customers);

    res.status(200).json(customers); // Return customers as JSON
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Error fetching customers" });
  }
}

async function createCustomer(req, res) {
  try {
    const { name, phone } = req.body;
    const newcustomer = await prisma.customer.create({
      data: {
        name: name,
        phone: phone,
      },
    });
    res.status(201).json(newcustomer);
  } catch (e) {
    console.log("some error occured while creating customer", e);
    res.status(500).json("some eroor");
  }
}

module.exports = {
  getCustomers,
  createCustomer,
};
