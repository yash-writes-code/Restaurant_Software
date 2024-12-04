import { Context } from "hono";
import { Customer } from "@prisma/client";
import prisma from "../../config/prisma";

const { customer: _customer, order, orderItem } = prisma;

// Create Order
export const createOrder = async (c: Context): Promise<Response> => {
  const { customerId, customerName, customerPhone, type, orderItems, status } = await c.req.json();
  console.log("Received order data:", { customerId, customerName, customerPhone, type, orderItems, status });

  try {
    let customer: Customer | null;

    if (customerId) {
      customer = await _customer.findUnique({ where: { id: customerId } });

      if (!customer) {
        return c.json({ error: "Customer not found." }, 404);
      }
    } else {
      customer = await _customer.upsert({
        where: { phone: customerPhone },
        update: { name: customerName },
        create: { name: customerName, phone: customerPhone },
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

    return c.json(newOrder, 201);
  } catch (error: any) {
    console.error("Error creating order:", error);
    if (error.code === "P2002") {
      return c.json({ error: "A customer with this phone number already exists." }, 409);
    }
    return c.json({ error: "An error occurred while creating the order." }, 500);
  }
};

// Update Order
export const updateOrder = async (c: Context): Promise<Response> => {
  const id = c.req.param("id");
  const { type, status, orderItems } = await c.req.json();

  try {
    const existingOrder = await order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!existingOrder) {
      return c.json({ error: "Order not found." }, 404);
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

    return c.json(updatedOrder, 200);
  } catch (error: any) {
    console.error("Error updating order:", error);
    return c.json({ error: "An error occurred while updating the order." }, 500);
  }
};

// Delete Order
export const deleteOrder = async (c: Context): Promise<Response> => {
  const id = c.req.param("id");

  try {
    const existingOrder = await order.findUnique({ where: { id } });

    if (!existingOrder) {
      return c.json({ error: "Order not found." }, 404);
    }

    await orderItem.deleteMany({ where: { id } });
    await order.delete({ where: { id } });

    return c.json({ message: "Order deleted successfully." }, 200);
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return c.json({ error: "An error occurred while deleting the order." }, 500);
  }
};
