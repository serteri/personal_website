import { PrismaClient } from '@prisma/client';

// Bu bölüm, geliştirme ortamında sürekli yeni Prisma Client'lar
// oluşmasını engelleyen ve tipi güvenli hale getiren modern bir yöntemdir.

const prismaClientSingleton = () => {
    return new PrismaClient();
};

declare global {

    var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;