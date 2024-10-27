const express = require('express');
const cors = require('cors');
const config = require('./config/appconfig');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = config.port;
const prisma = new PrismaClient();

const menuroutes = require('./routes/menuroutes');
const categoryroutes = require('./routes/categoryroutes');
const customerroutes = require('./routes/customerroutes');
const orderroutes = require('./routes/orderroutes');

// Middlewares
app.use(cors()); // Allows CORS for all origins by default
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies

// Routes
app.use('/api/menu-items', menuroutes);
app.use('/api/categories', categoryroutes);
app.use('/api/customers', customerroutes);
app.use('/api/orders', orderroutes);

// Graceful shutdown for Prisma
const handleExit = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Shutdown signals
process.on('SIGTERM', handleExit);
process.on('SIGINT', handleExit);
