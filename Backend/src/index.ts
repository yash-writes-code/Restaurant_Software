import config from './config/appconfig.js'
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = config.port;
const prisma = new PrismaClient();

//importing routes
import menuroutes from './routes/menuroutes.js';
import categoryroutes from './routes/categoryroutes.js';
import customerroutes from './routes/customerroutes.js';
import orderroutes from './routes/orderroutes.js';

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
