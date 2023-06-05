import { PrismaClient } from '@prisma/client';

/**
 * Clear all tables in DB (Postgres) using Prisma
 * @param prisma
 */
export async function truncateDBTablesPrisma(prisma: PrismaClient): Promise<void> {
  const models = Object.keys(prisma)
    .filter(item => {
      return !(item.startsWith('_') || item.endsWith('$extends'));
    })
    .map(str => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    })
    .map(model => model + 's');
  for (const model of models) {
    await prisma.$queryRawUnsafe(`TRUNCATE TABLE "${model}" CASCADE;`);
  }
}
