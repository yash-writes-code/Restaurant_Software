const express = require('express');
const app = express();
const port = 3000;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});