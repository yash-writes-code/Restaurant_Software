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

module.exports = {
  createOrder,
};
