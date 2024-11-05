const prisma = require("../config/prisma");

async function createOrder(req, res) {
  const { customerId, customerName, customerPhone, type, orderItems, status } =
    req.body;
  console.log("Received order data:", req.body);

  try {
    let customer;

    if (customerId) {
      // Use existing customer
      customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        return res.status(404).json({ error: "Customer not found." });
      }
    } else {
      // Create new customer or find by phone number
      
      customer = await prisma.customer.upsert({
        where: { phone: customerPhone },
        update: { name: customerName },
        create: {
          name: customerName,
          phone: customerPhone,
        },
      });
    }

    // Create the order
    const newOrder = await prisma.order.create({
      data: {
        type: type,
        status: status,
        customer: {
          connect: { id: customer.id },
        },
        orderItems: {
          create: orderItems.map((item) => ({
            menuItem: { connect: { id: item.menuItemId } },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: {
                priceOptions: true,
              },
            },
          },
        },
        customer: true,
      },
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.code === "P2002") {
      res
        .status(409)
        .json({ error: "A customer with this phone number already exists." });
    } else {
      res
        .status(500)
        .json({ error: "An error occurred while creating the order." });
    }
  }
}

async function updateOrder(req, res) {
  const { orderId } = req.params;
  const { type, status, orderItems } = req.body;

  try {
    // Find the existing order
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Delete old order items if new items are provided
    if (orderItems) {
      await prisma.orderItem.deleteMany({
        where: { orderId: orderId },
      });
    }

    // Update the order with new data and add new order items if provided
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        type: type || existingOrder.type,
        status: status || existingOrder.status,
        orderItems: {
          create: orderItems ? orderItems.map((item) => ({
            menuItem: { connect: { id: item.menuItemId } },
            quantity: item.quantity,
          })) : undefined,
        },
      },
      include: {
        orderItems: {
          include: {
            menuItem: {
              include: { priceOptions: true },
            },
          },
        },
        customer: true,
      },
    });

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "An error occurred while updating the order." });
  }
}

async function deleteOrder(req, res) {
  const { orderId } = req.params;

  try {
    // Check if the order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Delete the order and its related order items
    await prisma.orderItem.deleteMany({
      where: { orderId: orderId },
    });

    await prisma.order.delete({
      where: { id: orderId },
    });

    res.status(200).json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "An error occurred while deleting the order." });
  }
}

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder
};
