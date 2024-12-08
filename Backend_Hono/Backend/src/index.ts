import { Hono } from "hono";
import { cors } from "hono/cors";

// Importing routes
import menurouter from "./routers/menuroutes.js";
import categoryrouter from "./routers/categoryroutes.js";
import customerrouter from "./routers/customerroutes.js";
import orderrouter from "./routers/orderroutes.js";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    PORT?: number;
    CORS_ORIGIN?: string;
  };
}>();

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

// Handle requests
app.all("*", async (c) => {
  const env = c.env;
  console.log("Database URL:", env.DATABASE_URL);
  
  return c.json({ message: "Welcome to the API!" });
});


export default app;
