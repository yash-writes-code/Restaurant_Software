//import customer from "../config/prisma.js";
import prisma from "../config/prisma.js";
const {customer} = prisma;
import { Request,Response } from "express";

// GET all customers
export async function getCustomers(req: Request, res: Response) : Promise<void>{
  try {
    console.log("tryna find all customers");
    const customers = await customer.findMany(); // Fetch customers
    console.log("customers--------------> ", customers);

    res.status(200).json(customers); // Return customers as JSON
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Error fetching customers" });
  }
}

export async function createCustomer(req: Request, res: Response) :Promise<void> {
  try {
    const { name, phone } = req.body;
    const newcustomer = await customer.create({
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
