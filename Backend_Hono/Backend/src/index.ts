import { Hono } from "hono";
import { cors } from "hono/cors";
import { PrismaClient } from "@prisma/client";
import config from "../config/appconfig.js";

// Importing routes
import menurouter from "./routers/menuroutes.js";
import categoryrouter from "./routers/categoryroutes.js";
import customerrouter from "./routers/customerroutes.js";
import orderrouter from "./routers/orderroutes.js";

const app = new Hono();
const prisma = new PrismaClient();
const port = config.port;

// Middlewares
app.use("*", cors()); // Enable CORS for all routes
app.use("*", async (c, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

// Routes
app.route("/api/menu-items", menurouter);
app.route("/api/categories", categoryrouter);
app.route("/api/customers", customerrouter);
app.route("/api/orders", orderrouter);

// Graceful shutdown for Prisma
const handleExit = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

// Start server
console.log(`Server is running on http://localhost:${port}`);
app.fire();


// Shutdown signals
process.on("SIGTERM", handleExit);
process.on("SIGINT", handleExit);
