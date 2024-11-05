const express = require('express');
const router = express.Router();

const {createOrder,updateOrder,deleteOrder} = require("../controllers/ordercontrollers");

router.post('/',createOrder);
router.put('/:id',updateOrder);
router.post('/:id',deleteOrder);

module.exports = router;