const express = require('express');
const router = express.Router();

const {createOrder} = require("../controllers/ordercontrollers");

router.post('/',createOrder);

module.exports = router;