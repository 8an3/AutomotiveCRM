import { createReadableStreamFromReadable } from '@remix-run/node';
import { Readable } from 'node:stream';
import { prisma } from '~/libs';

export const loader = async () => {
  // Fetch data from the 'part' table using Prisma
  const data = await prisma.part.findMany();

  // Define the CSV headers
  const headers = [
    "partNumber",
    "brand",
    "name",
    "price",
    "cost",
    "quantity",
    "description",
    "category",
    "subCategory",
    "onOrder",
    "distributer"
  ];

  // Map the data to CSV rows
  const rows = data.map(entry => [
    entry.partNumber,
    entry.brand,
    entry.name,
    entry.price,
    entry.cost,
    entry.quantity,
    entry.description,
    entry.category,
    entry.subCategory,
    entry.onOrder,
    entry.distributer
  ].map(value => (value === null ? '' : value)).join(','));

  // Combine headers and rows into a single CSV string
  const csvContent = [headers.join(','), ...rows].join('\n');

  // Create a readable stream from the CSV string
  const file = createReadableStreamFromReadable(
    Readable.from([csvContent]),
  );

  // Return the response with appropriate headers for downloading the CSV file
  return new Response(file, {
    headers: {
      'Content-Disposition': 'attachment; filename="Parts.csv"',
      'Content-Type': 'text/csv',
    },
  });
};
