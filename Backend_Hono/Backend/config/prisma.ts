import { PrismaClient } from '@prisma/client/edge';

// Initialize Prisma Client with a direct database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZDYxNWMwYzEtMzZlMi00ODIxLThhZjQtZjE4ZjU5MzFhNGU0IiwidGVuYW50X2lkIjoiMDcxYmNiYzg0N2ExOWNmY2Y1ODNiYzg1NzRjY2FhMzc5ODhhN2NiYTgzZTRhNjI0NmM2MTY3YjBhZmM3MmRiMiIsImludGVybmFsX3NlY3JldCI6ImMzYTNhMzhjLTBkMDQtNGJkZC1hNTM5LWQ5NmQ5MDdjZmU1YSJ9.DQnGEHxn2bK7oYsV2ApNPrXZD73mOcteOkgHYZfoUAo", // Replace with your actual connection string
    },
  },
});

export default prisma;