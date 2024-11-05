const express = require("express");

const router = express.Router()

const {getCategories,createCategory}=  require("../controllers/categorycontrollers");

router.get('/',getCategories);


module.exports = router;