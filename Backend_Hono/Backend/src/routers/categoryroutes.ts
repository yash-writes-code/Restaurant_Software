import { Hono } from "hono";
import { getCategories, createCategory } from "../controllers/categorycontrollers.js";

const categoryRouter = new Hono();

categoryRouter.get("/", getCategories);
categoryRouter.post("/", createCategory);

export default categoryRouter;
