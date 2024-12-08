import { Hono } from "hono";
import { getCategories, createCategory } from "../controllers/categorycontrollers.js";

const categoryRouter = new Hono<{
    Bindings: {
      DATABASE_URL:string 
    }
  }>();

categoryRouter.get("/", getCategories);
categoryRouter.post("/", createCategory);

export default categoryRouter;
