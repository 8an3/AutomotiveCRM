import { json, LoaderFunction } from '@remix-run/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const loader: LoaderFunction = async () => {
  try {
    // Fetch all column names from the 'Finance' and 'Dashboard' tables
    const financeColumns = await getTableColumns('Finance');
    const dashboardColumns = await getTableColumns('Dashboard');
    const combined = [...financeColumns, ...dashboardColumns]
    console.log(combined);

    return json({ combined });
  } catch (error) {
    console.error('Error fetching columns:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
};

async function getTableColumns(tableName: string) {
  try {
    // Query the database schema to get all column names for the specified table
    const tableInfo = await prisma.$queryRaw`SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME =  ${tableName};`;
    const columns = tableInfo.map((info) => info.column_name);

    // Flatten the array of arrays into a single array of column names
    const flattenedColumns = columns.flatMap((column) => column);


    return flattenedColumns;
  } catch (error) {
    console.error(`Error fetching columns for table '${tableName}':`, error);
    throw error;
  }
}

export default loader;
