import { Request, Response, RequestHandler } from "express";
import { Customer } from "@prisma/client";
import prisma from "../config/prisma.js";
const { customer: _customer, order, orderItem } = prisma;

export const createOrder: RequestHandler = async (req, res): Promise<void> => {
  const { customerId, customerName, customerPhone, type, orderItems, status } = req.body;
  console.log("Received order data:", req.body);

  try {
    let customer: Customer | null;

    if (customerId) {
      customer = await _customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        res.status(404).json({ error: "Customer not found." });
        return; // Ensure the function doesn't continue
      }
    } else {
      customer = await _customer.upsert({
        where: { phone: customerPhone },
        update: { name: customerName },
        create: {
          name: customerName,
          phone: customerPhone,
        },
      });
    }

    const newOrder = await order.create({
      data: {
        type,
        status,
        customer: { connect: { id: customer.id } },
        orderItems: {
          create: orderItems.map((item: { menuItemId: string; quantity: number }) => ({
            menuItem: { connect: { id: item.menuItemId } },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: { include: { menuItem: { include: { priceOptions: true } } } },
        customer: true,
      },
    });

    res.status(201).json(newOrder);
  } catch (error: any) {
    console.error("Error creating order:", error);
    if (error.code === "P2002") {
      res.status(409).json({ error: "A customer with this phone number already exists." });
    } else {
      res.status(500).json({ error: "An error occurred while creating the order." });
    }
  }
};

// Similarly, add `Promise<void>` return type and ensure response is always ended
export const updateOrder: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params;
  const { type, status, orderItems } = req.body;

  try {
    const existingOrder = await order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!existingOrder) {
      res.status(404).json({ error: "Order not found." });
      return;
    }

    if (orderItems) {
      await orderItem.deleteMany({ where: { id } });
    }

    const updatedOrder = await order.update({
      where: { id },
      data: {
        type: type || existingOrder.type,
        status: status || existingOrder.status,
        orderItems: {
          create: orderItems
            ? orderItems.map((item: { menuItemId: string; quantity: number }) => ({
                menuItem: { connect: { id: item.menuItemId } },
                quantity: item.quantity,
              }))
            : undefined,
        },
      },
      include: {
        orderItems: { include: { menuItem: { include: { priceOptions: true } } } },
        customer: true,
      },
    });

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "An error occurred while updating the order." });
  }
};

export const deleteOrder: RequestHandler = async (req, res): Promise<void> => {
  const { id } = req.params;

  try {
    const existingOrder = await order.findUnique({ where: { id } });

    if (!existingOrder) {
      res.status(404).json({ error: "Order not found." });
      return;
    }

    await orderItem.deleteMany({ where: { id } });
    await order.delete({ where: { id } });

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "An error occurred while deleting the order." });
  }
};
