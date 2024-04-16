// src/routes/api/columnValues.ts

import { json, LoaderFunction } from '@remix-run/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const loader: LoaderFunction = async ({ params }) => {
  const { columnName } = params as { tableName: string; columnName: string };

  try {
    // Query the database to get all distinct values from the specified column
    let columnValues
    columnValues = await prisma.$queryRaw`
      SELECT DISTINCT ${columnName} FROM dashboard;
    `;
    if (columnValues.length() > 0) {
      columnValues = await prisma.$queryRaw`
      SELECT DISTINCT ${columnName} FROM finance;
    `;
    }

    return json({ columnValues });
  } catch (error) {
    console.error('Error fetching column values:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};
