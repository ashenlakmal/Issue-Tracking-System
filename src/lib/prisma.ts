// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient to use throughout the app
export const prisma = new PrismaClient();