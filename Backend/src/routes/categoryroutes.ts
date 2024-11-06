import { Router } from "express";

const router = Router()

import {getCategories,createCategory} from "../controllers/categorycontrollers.js"

router.get('/',getCategories);
router.post("/",createCategory);

export default router;