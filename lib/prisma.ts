// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') (global as any).prisma = prisma;

export default prisma;