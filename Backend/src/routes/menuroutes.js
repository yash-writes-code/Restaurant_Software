const express = require('express');
const { getMenuItem,createMenuItem,deleteMenuItem , updateMenuItem} = require('../controllers/menucontrollers');
const router = express.Router();

// Route for creating a new menu item
router.get('/',getMenuItem);
router.post('/', createMenuItem);
router.delete('/:id',deleteMenuItem);
router.put('/:id',updateMenuItem);


module.exports = router;